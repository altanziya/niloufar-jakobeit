'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

interface ParallaxSectionTransitionProps {
  firstSection: React.ReactNode;
  secondSection: React.ReactNode;
  bgColor?: string;
  triggerAnimations?: () => void;
}

const ParallaxSectionTransition: React.FC<ParallaxSectionTransitionProps> = ({
  firstSection,
  secondSection,
  bgColor = "#191919",
  triggerAnimations
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Exakt wie in der Beschreibung: start start bis end end
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Skalierung und Rotation für erste Sektion: 1 -> 0.8 und 0 -> -5
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -5]);

  // Skalierung und Rotation für zweite Sektion: 0.8 -> 1 und -5 -> 0
  const scale2 = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-5, 0]);

  // Animationstrigger
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value > 0.2 && triggerAnimations) {
        triggerAnimations();
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, triggerAnimations]);

  // Lenis smooth scroll genau wie in der Beschreibung
  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // Exakt wie in der Beschreibung: relative container mit 200vh Höhe
    <main ref={containerRef} className="relative h-[200vh]" style={{ backgroundColor: bgColor }}>
      {/* Erste Sektion - sticky, genau wie in der Beschreibung */}
      <motion.section 
        className="sticky top-0 w-full h-screen" 
        style={{ scale: scale1, rotate: rotate1 }}
      >
        {firstSection}
      </motion.section>

      {/* Zweite Sektion - einfach normal fließend positioniert */}
      <motion.section 
        className="w-full h-screen" 
        style={{ scale: scale2, rotate: rotate2 }}
      >
        {secondSection}
      </motion.section>
    </main>
  );
};

export default ParallaxSectionTransition;