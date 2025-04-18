'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '@/components/providers/LenisProvider';
import CharacterHover from '@/components/common/CharacterHover';
import { HeroSectionProps } from '@/config/sections';

// Erweiterte SplitText Komponente mit modernen Effekten und Hover-Effekt
const ModernSplitText = ({ 
  text = "", 
  className, 
  style, 
  delay = 0,
  wordDelay = 0.12,
  charDelay = 0.02,
  animate = false
}: {
  text?: string,
  className?: string,
  style?: React.CSSProperties,
  delay?: number,
  wordDelay?: number,
  charDelay?: number,
  animate?: boolean
}) => {
  // Make sure text is a string and split it into words
  const words = (text || "").split(' ');
  
  // Moderne Animation Variante mit Maskierung
  const wordVariants = {
    hidden: { 
      y: 120,
      opacity: 0,
      filter: "blur(8px)",
      rotateX: -15,
      skewX: "-5deg",
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)", 
      rotateX: 0,
      skewX: "0deg",
      transition: {
        duration: 0.9,
        delay: delay + (i * wordDelay),
        ease: [0.25, 0.1, 0.25, 1.0], 
      }
    })
  };

  return (
    <div 
      className={`overflow-hidden perspective-1000 ${className}`} 
      style={{...style, lineHeight: 1.15, transformStyle: 'preserve-3d'}}
    >
      {words.map((word, wordIndex) => (
        <div
          key={wordIndex}
          className="inline-block overflow-hidden mr-[0.25em] align-bottom transform-style-3d"
          style={{ 
            display: "inline-block", 
            willChange: "transform, opacity, filter",
            verticalAlign: "bottom",
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.span
            custom={wordIndex}
            variants={wordVariants}
            initial="hidden"
            animate={animate ? "visible" : "hidden"}
            className="inline-block transform-style-3d"
            style={{
              display: "inline-block",
              verticalAlign: "bottom",
              transformOrigin: "center bottom",
              willChange: "transform, opacity, filter",
              transformStyle: 'preserve-3d'
            }}
          >
            <CharacterHover text={word || ""} />
          </motion.span>
        </div>
      ))}
    </div>
  );
};

// Einzeiliger Text mit gestaffelten Buchstaben und Hover-Effekt
const AnimatedSubtitle = ({
  text = "",
  delay = 0,
  className = "",
  style = {},
  animate = false
}: {
  text?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}) => {
  const subtitleVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
      skewX: "-3deg",
    },
    visible: {
      opacity: 1,
      y: 0,
      skewX: "0deg",
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.215, 0.61, 0.355, 1.0], // Cubic bezier equivalent to ease-out-cubic
      }
    }
  };

  return (
    <motion.div
      className={`overflow-hidden perspective-1000 ${className}`}
      style={{...style, transformStyle: 'preserve-3d'}}
      variants={subtitleVariants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
    >
                    <CharacterHover text={text || ""} />
    </motion.div>
  );
};

const Hero = ({ title, subtitle, image = "/images/interior10.jpg" }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);
  
  // Intelligentes Timing für die Animation
  useEffect(() => {
    // Bild sofort als geladen markieren
    setIsImageLoaded(true);
    
    // Animation erst später starten - nach dem Preloader
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, prefersReducedMotion ? 800 : 3200); // Kürzere Zeit bei Reduced Motion
    
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);
  
  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-900 overflow-hidden min-h-screen h-screen flex items-center"
      aria-label="Welcome section"
    >
      {/* Full screen image container */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { duration: prefersReducedMotion ? 0.5 : 1.2, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Etwas dunklerer Overlay */}
        <Image
          src={image}
          alt="Interior design showcase"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onLoad={() => setIsImageLoaded(true)}
        />
      </motion.div>
      
      {/* Text container - positioniert in der rechten Bildhälfte, linksbündig */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-20 relative">
        <div className="ml-auto w-full md:w-3/5 lg:w-1/2 flex flex-col items-start">
          {/* Haupttitel mit moderner Animation */}
          <ModernSplitText
            text={title}
            animate={animationStarted}
            delay={0.4} // Verzögerung nach dem Start der Animation
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[9rem] font-serif tracking-wider uppercase text-left"
          />
          
          {/* Untertitel */}
          {subtitle && (
            <AnimatedSubtitle
              text={subtitle}
              animate={animationStarted}
              delay={1.8} // Nach der Hauptanimation
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-left"
              style={{ willChange: 'transform, opacity' }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;