'use client';

import { ReactNode, useRef, useEffect, createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';

// Create context to provide Lenis instance to children components
interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: any) => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {}
});

// Hook to use Lenis in any component
export const useLenis = () => useContext(LenisContext);

// Erweitere den Typ für die Lenis-Optionen
interface ExtendedLenisOptions {
  duration: number;
  easing: (t: number) => number;
  orientation: 'vertical' | 'horizontal';
  smooth: boolean;
  smoothTouch: boolean;
  touchMultiplier: number;
  [key: string]: any; // Erlaube zusätzliche Eigenschaften
}

interface LenisProviderProps {
  children: ReactNode;
  options?: Partial<ExtendedLenisOptions>;
}

export default function LenisProvider({ 
  children,
  options
}: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  
  // Default options with cubic-bezier easing
  const defaultOptions: ExtendedLenisOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    orientation: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  useEffect(() => {
    // Init Lenis nur wenn es im Browser läuft
    if (typeof window === 'undefined') return;
    
    // Initialize lenis for smooth scrolling
    lenisRef.current = new Lenis(mergedOptions);
    
    // Raf Loop für Lenis
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    
    const animationId = requestAnimationFrame(raf);
    
    // Integrate with GSAP ScrollTrigger if available
    const addScrollTrigger = () => {
      // @ts-ignore - Window mit GSAP erweitern
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        // @ts-ignore - GSAP and ScrollTrigger sind über CDN geladen
        window.ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop(value: number) {
            if (arguments.length && lenisRef.current) {
              lenisRef.current.scrollTo(value);
            }
            return lenisRef.current ? lenisRef.current.scroll : 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
        });

        // ScrollTrigger update on scroll
        const scrollHandler = () => {
          // @ts-ignore
          window.ScrollTrigger && window.ScrollTrigger.update();
        };
        
        // Lenis Scroll-Event für GSAP
        lenisRef.current?.on('scroll', scrollHandler);
      }
    };

    // Try to add ScrollTrigger integration
    addScrollTrigger();

    // Poll for ScrollTrigger availability - will self-clear when found
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && 'ScrollTrigger' in window) {
        addScrollTrigger();
        clearInterval(intervalId);
      }
    }, 500);
    
    // Add lenis-smooth class to html
    document.documentElement.classList.add('lenis-smooth');
    
    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      document.documentElement.classList.remove('lenis-smooth');
    };
  }, [mergedOptions]);
  
  // Utility function to scroll to elements
  const scrollTo = (target: string | HTMLElement | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };
  
  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}