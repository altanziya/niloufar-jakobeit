'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useLenis } from '@/components/providers/LenisProvider';  // Korrigierter Import-Pfad
import styles from './TextMaskScroll.module.css';

interface TextMaskScrollProps {
  triggerOnVisible?: boolean;
}

const TextMaskScroll: React.FC<TextMaskScrollProps> = ({ 
  triggerOnVisible = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyMaskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [scrollableHeight, setScrollableHeight] = useState('300vh'); // Default Höhe
  const { lenis } = useLenis(); // Lenis-Instanz abrufen
  
  // Use framer-motion's useInView to detect when the component is visible
  const isInView = useInView(containerRef, { 
    once: true, 
    amount: 0.1 
  });

  // Constants for the mask scaling
  const initialMaskSize = 1; // 80% initial size
  const targetMaskSize = 30;   // Scale up to 3000%
  const easing = 0.15;         // Smooth easing value
  
  // State for the eased scroll value
  let easedScrollProgress = 0;

  // Unblock scroll on mount and cleanup on unmount
  useEffect(() => {
    if (!lenis) return;

    // Aktualisiere Lenis nach dem Rendern
    lenis.resize();
    
    return () => {
      if (lenis) {
        lenis.resize();
      }
    };
  }, [lenis]);

  // Ensure we can scroll to the end
  useEffect(() => {
    if (!isReady || !containerRef.current) return;
    
    // Manuelle Aktualisierung der Lenis-Instanz, wenn sich die Komponente geändert hat
    if (lenis) {
      lenis.resize();
    }
    
    // Stelle sicher, dass die Scrollbarkeit aktualisiert wird
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Füge einen zusätzlichen Scroll-Handler hinzu, der sicherstellt, dass wir bis zum Ende scrollen können
    const handleWheel = (e: WheelEvent) => {
      // Nur eingreifen, wenn wir in der Nähe des Endes der Animation sind
      if (containerRef.current && containerRef.current.getBoundingClientRect().bottom <= window.innerHeight * 1.5) {
        // Verhindere nicht das Standard-Verhalten, lasse es zu
        e.stopPropagation();
      }
    };
    
    // Capture phase, um vor Lenis einzugreifen
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isReady, lenis]);

  useEffect(() => {
    // Only initialize when component is in view and ready to animate
    if (isInView && triggerOnVisible) {
      setIsReady(true);
    }
  }, [isInView, triggerOnVisible]);

  useEffect(() => {
    if (!isReady) return;
    
    // Calculate the optimal scrollable height based on viewport
    const calculateOptimalHeight = () => {
      const vh = window.innerHeight;
      // Für eine 3-phasen Animation (Start, Animation, Ende-Sichtbar) verwenden wir 2.5x die Viewport-Höhe
      const optimalHeight = Math.max(vh * 2.5, 1000); // Mindestens 1000px oder 2.5 Viewports
      return `${optimalHeight}px`;
    };
    
    setScrollableHeight(calculateOptimalHeight());
    
    // Wenn sich die Fenstergröße ändert, aktualisieren wir die optimale Höhe
    const handleResize = () => {
      setScrollableHeight(calculateOptimalHeight());
      if (lenis) lenis.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    let animationFrameId: number;
    
    const animate = () => {
      if (!containerRef.current || !stickyMaskRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      const scrollProgress = getScrollProgress();
      const maskSizeProgress = targetMaskSize * scrollProgress;
      
      // Apply the mask size
      stickyMaskRef.current.style.webkitMaskSize = `${(initialMaskSize + maskSizeProgress) * 100}%`;
      stickyMaskRef.current.style.maskSize = `${(initialMaskSize + maskSizeProgress) * 100}%`;
      
      // Wenn Animation abgeschlossen, stelle sicher dass Video sichtbar bleibt
      if (scrollProgress >= 0.99 && videoRef.current) {
        videoRef.current.style.opacity = '1';
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const getScrollProgress = () => {
      if (!containerRef.current || !stickyMaskRef.current) return 0;
      
      // Calculate scroll progress based on container's position and visibility
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      
      // Angepasste Berechnung die gleichmäßig von 0 bis 1 fortschreitet
      const scrolled = -containerTop;
      const totalScrollDistance = containerHeight - viewportHeight;
      
      // Ensures we reach 1.0 exactly at the end of the scrollable area
      const rawProgress = Math.min(scrolled / totalScrollDistance, 1);
      
      // Apply easing to the scroll progress
      const delta = rawProgress - easedScrollProgress;
      easedScrollProgress += delta * easing;
      
      // Clamp the value between 0 and 1
      return Math.max(0, Math.min(1, easedScrollProgress));
    };
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady, lenis]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-neutral-900"
      style={{ height: scrollableHeight }} // Dynamische Höhe
    >
      <div 
        ref={stickyMaskRef} 
        className={`sticky top-0 flex items-center justify-center overflow-hidden h-screen w-full ${styles.maskContainer}`}
        style={{
          maskImage: 'url(/images/mask.svg)',
          WebkitMaskImage: 'url(/images/mask.svg)',
          maskPosition: '52.35% center',
          WebkitMaskPosition: '52.35% center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskSize: '80%',
          WebkitMaskSize: '80%',
        }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/images/nature.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Dummy-Element, um sicherzustellen, dass wir bis zum Ende scrollen können */}
      <div className="h-screen bg-transparent" aria-hidden="true"></div>
    </div>
  );
};

export default TextMaskScroll;