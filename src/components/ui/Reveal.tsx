'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variant, useReducedMotion, type UseInViewOptions } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type EasingFunction = [number, number, number, number] | string;

interface RevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%' | string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  ease?: EasingFunction;
  once?: boolean;
  className?: string;
  distance?: number;
  threshold?: number;
  rootMargin?: string;
  withMarkers?: boolean;
}

export default function Reveal({
  children,
  width = 'fit-content',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  ease = [0.19, 1, 0.22, 1], // Default to out-expo
  once = true,
  className = '',
  distance = 50,
  threshold = 0.1,
  rootMargin = '-10% 0px -10% 0px',
  withMarkers = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle SSR/hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use more configurable inView options
  // Verwende eine einfache Lösung mit Type-Assertion
  const isInView = useInView(ref, {
    once,
    margin: rootMargin as any, // Type-Assertion für MarginType
    amount: threshold
  });

  // Define variants based on direction
  const getInitialVariant = (): Variant => {
    // For users who prefer reduced motion, use fade only
    if (prefersReducedMotion) {
      return { opacity: 0 };
    }

    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const variants = {
    hidden: getInitialVariant(),
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0, 
      transition: { 
        duration, 
        delay, 
        ease 
      } 
    }
  };

  // For SSR, return null initially to prevent hydration mismatch
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={{ width, overflow: 'hidden', position: 'relative' }}
      className={className}
    >
      {withMarkers && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            border: isInView ? '2px solid green' : '2px solid red',
            zIndex: 100,
            pointerEvents: 'none',
            opacity: 0.3
          }} 
        />
      )}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// For staggered animations of multiple items
export function RevealGroup({
  children,
  className = '',
  staggerDelay = 0.1,
  staggerDirection = 'up',
  staggerDistance = 40,
  containerClassName = '',
  ease = [0.19, 1, 0.22, 1], // out-expo
  duration = 0.5,
  once = true,
  staggerChildrenClassName = '',
}: {
  children: ReactNode[];
  className?: string;
  containerClassName?: string;
  staggerDelay?: number;
  staggerDirection?: Direction;
  staggerDistance?: number;
  ease?: EasingFunction;
  duration?: number;
  once?: boolean;
  staggerChildrenClassName?: string;
}) {
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  // Two options: use Framer Motion's built-in stagger or individual reveals
  // Method 1: Using individual Reveal components (more flexible)
  const individualReveals = (
    <div className={`${className} ${containerClassName}`}>
      {children.map((child, index) => (
        <Reveal
          key={index}
          delay={index * staggerDelay}
          direction={staggerDirection}
          distance={staggerDistance}
          ease={ease}
          duration={duration}
          once={once}
          className={staggerChildrenClassName}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );

  // Method 2: Using Framer Motion's built-in stagger (more performance-optimized)
  const getDirectionVariant = (): Variant => {
    switch (staggerDirection) {
      case 'up':
        return { opacity: 0, y: staggerDistance };
      case 'down':
        return { opacity: 0, y: -staggerDistance };
      case 'left':
        return { opacity: 0, x: staggerDistance };
      case 'right':
        return { opacity: 0, x: -staggerDistance };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: staggerDistance };
    }
  };

  const itemVariants = {
    hidden: getDirectionVariant(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease
      }
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });

  const framerStagger = (
    <motion.div
      ref={ref}
      className={`${className} ${containerClassName}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children.map((child, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          className={staggerChildrenClassName}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );

  // Choose which method to return
  return framerStagger; // Default to the more optimized version
}