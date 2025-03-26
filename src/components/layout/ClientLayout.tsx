'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from '@/components/common/Preloader';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import LenisProvider from '@/components/providers/LenisProvides';
import Hero from '@/components/sections/Hero';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Konsistenter Hintergrund für die gesamte Seite
    document.body.style.backgroundColor = '#191919';
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
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
  // WICHTIG: Die Struktur und Farben müssen identisch sein
  const heroContent = (
    <div className="w-full h-full bg-neutral-900">
      <Hero />
    </div>
  );

  // Die wichtige Übergangsfunktion
  const handlePreloaderExit = () => {
    // 1. Signalisieren, dass der Preloader ausgeblendet wird
    setPreloaderExiting(true);
    
    // 2. Verzögerung BEVOR der Hauptcontent eingeblendet wird (um sicherzustellen, dass er nicht zu früh erscheint)
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
    <>
      {/* Persistenter Hintergrund - IMMER sichtbar */}
      <div className="fixed inset-0 bg-neutral-900" style={{ zIndex: 0 }} />
      
      {/* Anti-Flackern Overlay - Dieser wird während des gesamten Übergangs sichtbar bleiben */}
      <div 
        className="fixed inset-0 bg-neutral-900 pointer-events-none"
        style={{ 
          zIndex: 20,
          opacity: 1,
          transition: 'opacity 2s ease-in-out'
        }}
      />
      
      {/* Hauptcontent - einblenden erst nachdem die Übergangsverzögerung abgelaufen ist */}
      <motion.div
        ref={contentRef}
        key="layout"
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

        <LenisProvider>
          <main className="bg-neutral-900">
            {children}
          </main>
        </LenisProvider>
        
        <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 opacity-30" />
      </motion.div>

      {/* Preloader - bleibt sichtbar während des gesamten Übergangs */}
      <AnimatePresence mode="wait">
        {!preloaderComplete && (
          <Preloader 
            onComplete={handlePreloaderExit} 
            customDuration={2800}
            heroContent={heroContent}
            isTransitioning={preloaderExiting}
          />
        )}
      </AnimatePresence>
    </>
  );
}