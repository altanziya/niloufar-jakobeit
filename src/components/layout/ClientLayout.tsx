'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Preloader from '@/components/common/Preloader';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import LenisProvider from '@/components/providers/LenisProvider';
import Hero from '@/components/sections/Hero';
import { sections } from '@/config/sections';
import { isHeroSection } from '@/types/section';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const redirectedRef = useRef(false);

  // Get hero section from config if available
  const heroSection = sections.find(section => isHeroSection(section));
  const heroProps = heroSection?.props || { title: "My Sweet Home", subtitle: "by Niloufar Jakobeit" };

  // Erste Priorität: Sofortige Umleitung bei Page-Refresh und nicht auf Homepage
  useEffect(() => {
    // Schon beim ersten Rendering überprüfen, ob wir umleiten müssen
    if (typeof window !== 'undefined' && pathname !== '/' && !redirectedRef.current) {
      // Refresh-Erkennung
      const isRefreshed = 
        typeof performance !== 'undefined' && 
        (
          (performance.navigation && performance.navigation.type === 1) || 
          (performance.getEntriesByType('navigation').length > 0 && 
           (performance.getEntriesByType('navigation')[0] as any).type === 'reload')
        );
      
      if (isRefreshed) {
        redirectedRef.current = true;
        // Direkte Navigation mit window.location für sofortigen Effekt
        window.location.href = '/';
      }
    }
  }, [pathname]);

  // Alle anderen Initialisierungen erst nach dem Redirect-Check
  useEffect(() => {
    setMounted(true);
    
    // Konsistenter Hintergrund für die gesamte Seite
    document.body.style.backgroundColor = '#191919';
  }, []);

  // Nur noch Klassen für CSS-Styling hinzufügen/entfernen, keine Overflow-Manipulation
  useEffect(() => {
    if (mounted) {
      if (isMenuOpen) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen, mounted]);

  const pageVariants = {
    initial: { 
      opacity: 0
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: [0.19, 1, 0.22, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  // Exakte Kopie der Hero für den Preloader
  const heroContent = (
    <div className="w-full h-full bg-neutral-900">
      <Hero {...heroProps} />
    </div>
  );

  // Die wichtige Übergangsfunktion
  const handlePreloaderExit = () => {
    // 1. Signalisieren, dass der Preloader ausgeblendet wird
    setPreloaderExiting(true);
    
    // 2. Verzögerung BEVOR der Hauptcontent eingeblendet wird
    setTimeout(() => {
      setTransitionComplete(true);
      
      // 3. Lange Verzögerung bevor der Preloader komplett entfernt wird
      setTimeout(() => {
        setPreloaderComplete(true);
      }, 1800); // Sehr lange Verzögerung - der Preloader bleibt sichtbar bis der Hauptinhalt vollständig da ist
    }, 200);
  };

  if (!mounted) {
    return null;
  }

  return (
    <LenisProvider>
      {/* Persistenter Hintergrund - IMMER sichtbar */}
      <div className="fixed inset-0 bg-neutral-900" style={{ zIndex: 0 }} />
      
      {/* Anti-Flackern Overlay */}
      <div 
        className="fixed inset-0 bg-neutral-900 pointer-events-none"
        style={{ 
          zIndex: 20,
          opacity: 1,
          transition: 'opacity 2s ease-in-out'
        }}
      />
      
      {/* Hauptcontent */}
      <motion.div
        ref={contentRef}
        key={`content-${pathname}`}
        className="relative"
        variants={pageVariants}
        initial="initial"
        animate={transitionComplete ? "animate" : "initial"}
        exit="exit"
        style={{ 
          zIndex: 40,
          position: 'relative'
        }}
      >  
        <Header onOpenMenu={() => setIsMenuOpen(true)} />

        <MenuOverlay 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />

        <main className="bg-neutral-900">
          {children}
        </main>
        
        <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 opacity-30" />
      </motion.div>

      {/* Preloader */}
      <AnimatePresence mode="wait">
        {!preloaderComplete && (
          <Preloader 
            key={`preloader-${pathname}`}
            onComplete={handlePreloaderExit} 
            customDuration={2800}
            heroContent={heroContent}
            isTransitioning={preloaderExiting}
          />
        )}
      </AnimatePresence>
    </LenisProvider>
  );
}