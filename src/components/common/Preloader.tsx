'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
  customDuration?: number;
  heroContent?: React.ReactNode;
  isTransitioning?: boolean; // Neuer Prop für Transition-Status
}

const Preloader = ({ 
  onComplete, 
  customDuration = 3000, 
  heroContent,
  isTransitioning = false
}: PreloaderProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHero, setShowHero] = useState(false);
  const [internalTransitioning, setInternalTransitioning] = useState(false);

  useEffect(() => {
    // Simuliere Ladefortschritt
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 4;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, customDuration / 400);

    // Zeige die Hero-Komponente SEHR früh
    const heroTimer = setTimeout(() => {
      setShowHero(true);
    }, customDuration * 0.05); // Nach nur 5% der Zeit

    // Haupttimer für Preloader
    const timer = setTimeout(() => {
      setInternalTransitioning(true);
      
      // Eine kurze Verzögerung bevor wir den Callback aufrufen
      setTimeout(() => {
        if (onComplete) onComplete();
        
        // Erhöhen wir die Verzögerung bevor wir intern als abgeschlossen markieren
        setTimeout(() => {
          setIsComplete(true);
        }, 500); // Längere Verzögerung 
      }, 200);
    }, customDuration);

    return () => {
      clearTimeout(timer);
      clearTimeout(heroTimer);
      clearInterval(interval);
    };
  }, [customDuration, onComplete]);

  // Anzahl der vertikalen Balken
  const bars = 5;
  
  // Easing für explosivere Animation mit langsamem Start
  const ease = [0.2, 0, 0.1, 1];
  
  // Animationsdauer pro Balken
  const animationDuration = 0.45;
  
  // Basisverzögerung
  const baseDelay = 0.03;
  
  // Berechnung der Verzögerung für jeden Balken
  const getStaggerDelay = (index: number) => {
    return index === 0 ? 0 : baseDelay + (index * animationDuration * 0.5);
  };

  // Verzögerung vor dem Aufrufen von onComplete
  const handleExitComplete = () => {
    // Nichts tun - wir verwalten jetzt alles über den onComplete Callback
  };

  // Die Hauptanimation sollte nur starten, wenn internalTransitioning true ist
  // isTransitioning vom Parent wird für Opazität verwendet
  const shouldAnimate = internalTransitioning;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {!isComplete && (
        <>
          {/* Hero im Hintergrund - sehr früh mit weicher Überblendung */}
          <div 
            className="fixed inset-0 z-30 overflow-hidden bg-neutral-900"
            style={{ 
              opacity: showHero ? 1 : 0,
              transition: 'opacity 2s ease-in-out', // Sehr lange, weiche Überblendung
              pointerEvents: 'none'
            }}
          >
            {heroContent}
          </div>

          {/* Kompletter Preloader mit Balken und Text */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-row pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: isTransitioning ? 0.99 : 1 // Minimal reduzierte Opazität während des Übergangs
            }}
            exit={{ 
              opacity: shouldAnimate ? 0 : 1, 
              transition: {
                duration: 0.9, // Längere Ausblendung
                delay: animationDuration + getStaggerDelay(bars - 1) + 0.1,
                ease: [0.19, 1, 0.22, 1] 
              }
            }}
          >
            {/* Die 5 vertikalen Balken */}
            {Array.from({ length: bars }).map((_, index) => (
              <div 
                key={index}
                className="relative h-full"
                style={{ width: `${100 / bars}%` }}
              >
                {/* Obere Hälfte des Balkens */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1/2 bg-[#d7d6d4]"
                  initial={{ y: 0 }}
                  exit={{ 
                    y: shouldAnimate ? '-100%' : 0,
                    transition: {
                      duration: animationDuration,
                      ease,
                      delay: getStaggerDelay(index)
                    }
                  }}
                  style={{ willChange: 'transform' }}
                />
                
                {/* Untere Hälfte des Balkens */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1/2 bg-[#d7d6d4]"
                  initial={{ y: 0 }}
                  exit={{ 
                    y: shouldAnimate ? '100%' : 0,
                    transition: {
                      duration: animationDuration,
                      ease,
                      delay: getStaggerDelay(index)
                    }
                  }}
                  style={{ willChange: 'transform' }}
                />
              </div>
            ))}
            
            {/* Preloader Inhalte (Logo, Titel, Fortschrittsleiste) */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: shouldAnimate ? 0 : 1,
                transition: {
                  duration: 0.8,
                  ease,
                  delay: 0.1
                }
              }}
            >
              <motion.h1
                className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-serif tracking-wider uppercase text-[#b69a7e]"
                initial={{ opacity: 0, letterSpacing: '-0.05em' }}
                animate={{ 
                  opacity: 1, 
                  letterSpacing: '0.1em',
                  transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
                }}
                style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  willChange: 'opacity, letter-spacing' 
                }}
              >
                MY SWEET HOME
              </motion.h1>
              
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#b69a7e] mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  willChange: 'opacity' 
                }}
              >
                by Nilou
              </motion.h2>
              
              <div className="relative h-0.5 w-32 sm:w-48 md:w-64 bg-[#b69a7e]/20 mt-8">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#b69a7e]/80"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: customDuration / 1000, ease: 'linear' }}
                  style={{ willChange: 'transform' }}
                />
              </div>
              
              <motion.p 
                className="text-[#b69a7e]/70 text-sm sm:text-base mt-4 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {progress}%
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Preloader;