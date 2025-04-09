'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterHover from '@/components/common/CharacterHover';

interface PreloaderProps {
  onComplete?: () => void;
  customDuration?: number;
  heroContent?: React.ReactNode;
  isTransitioning?: boolean;
  isShortVersion?: boolean; // Neuer Parameter für interne Navigation
}

const DEFAULT_DURATION = 2800;

const Preloader = ({ 
  onComplete, 
  customDuration = DEFAULT_DURATION, 
  heroContent,
  isTransitioning = false,
  isShortVersion = false
}: PreloaderProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHero, setShowHero] = useState(false);
  const [internalTransitioning, setInternalTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Berechnung des Speedup-Faktors
  const speedFactor = DEFAULT_DURATION / customDuration;

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Simuliere Ladefortschritt - schneller für kurze Version
    const progressStep = isShortVersion ? 10 : 4; // Schnellerer Fortschritt
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressStep;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, customDuration / 400);

    // Zeige die Hero-Komponente SEHR früh - noch früher für kurze Version
    const heroTimeFactor = isShortVersion ? 0.01 : 0.05;
    const heroTimer = setTimeout(() => {
      setShowHero(true);
    }, customDuration * heroTimeFactor);

    // Haupttimer für Preloader
    const timer = setTimeout(() => {
      setInternalTransitioning(true);
      
      // Eine kurze Verzögerung bevor wir den Callback aufrufen
      const callbackDelay = isShortVersion ? 80 : 200; 
      setTimeout(() => {
        if (onComplete) onComplete();
        
        // Erhöhen wir die Verzögerung bevor wir intern als abgeschlossen markieren
        const completionDelay = isShortVersion ? 200 : 500;
        setTimeout(() => {
          setIsComplete(true);
        }, completionDelay);
      }, callbackDelay);
    }, prefersReducedMotion ? 500 : customDuration);

    return () => {
      clearTimeout(timer);
      clearTimeout(heroTimer);
      clearInterval(interval);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [customDuration, onComplete, prefersReducedMotion, isShortVersion]);

  // Anzahl der vertikalen Balken
  const bars = 5;
  
  // Easing für explosivere Animation mit langsamem Start
  const ease = [0.2, 0, 0.1, 1];
  
  // Animationsdauer pro Balken - schneller für kurze Version
  const animationDuration = prefersReducedMotion ? 0.15 : (isShortVersion ? 0.25 : 0.45);
  
  // Basisverzögerung - schneller für kurze Version
  const baseDelay = prefersReducedMotion ? 0.01 : (isShortVersion ? 0.015 : 0.03);
  
  // Berechnung der Verzögerung für jeden Balken
  const getStaggerDelay = (index: number) => {
    const delay = index === 0 ? 0 : baseDelay + (index * animationDuration * 0.5);
    return delay;
  };

  // Die Hauptanimation sollte nur starten, wenn internalTransitioning true ist
  const shouldAnimate = internalTransitioning;

  // Transition Zeit für die Text-Animation - schneller für kurze Version
  const textAnimationDuration = isShortVersion ? 0.6 : 1.2;
  const textAnimationDelay = isShortVersion ? 0.2 : 0.4;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => {}}>
      {!isComplete && (
        <>
          {/* Hero im Hintergrund - sehr früh mit weicher Überblendung */}
          <div 
            className="fixed inset-0 z-30 overflow-hidden bg-neutral-900"
            style={{ 
              opacity: showHero ? 1 : 0,
              transition: `opacity ${isShortVersion ? '1s' : '2s'} ease-in-out`, // Kürzere Überblendung für kurze Version
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          >
            {heroContent}
          </div>

          {/* Kompletter Preloader mit Balken und Text */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-row pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: isTransitioning ? 0.99 : 1
            }}
            exit={{ 
              opacity: shouldAnimate ? 0 : 1, 
              transition: {
                duration: isShortVersion ? 0.5 : 0.9,
                delay: animationDuration + getStaggerDelay(bars - 1) + (isShortVersion ? 0.05 : 0.1),
                ease: [0.19, 1, 0.22, 1] 
              }
            }}
            role="progressbar"
            aria-busy={!isComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Loading page content"
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
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-50"
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: shouldAnimate ? 0 : 1,
                transition: {
                  duration: isShortVersion ? 0.4 : 0.8,
                  ease,
                  delay: isShortVersion ? 0.05 : 0.1
                }
              }}
            >
              <motion.h1
                className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-serif tracking-wider uppercase perspective-1000"
                initial={{ opacity: 0, letterSpacing: '-0.05em' }}
                animate={{ 
                  opacity: 1, 
                  letterSpacing: '0.1em',
                  transition: { duration: textAnimationDuration, ease: [0.19, 1, 0.22, 1] }
                }}
                style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  willChange: 'opacity, letter-spacing',
                  transform: 'perspective(1000px) rotateX(0.5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <CharacterHover text="MY SWEET HOME" isPreloader={true} />
              </motion.h1>
              
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mt-4 perspective-1000"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: textAnimationDelay / speedFactor, duration: textAnimationDuration, ease: [0.19, 1, 0.22, 1] }}
                style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  willChange: 'opacity',
                  transform: 'perspective(1000px) rotateX(0.5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <CharacterHover text="by Nilou" isPreloader={true} />
              </motion.h2>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Preloader;