'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPOptions {
  animation?: gsap.TweenVars;
  scrollTrigger?: ScrollTrigger.Vars | boolean;
  fromVars?: gsap.TweenVars;
  toVars?: gsap.TweenVars;
  duration?: number;
  delay?: number;
  ease?: string;
  markers?: boolean;
  scrub?: boolean | number;
  pin?: boolean;
  // anticipatePin wurde entfernt, da es Typ-Fehler verursacht
  start?: string;
  end?: string;
  toggleActions?: string;
}

export function useGSAP<T extends HTMLElement>(
  options: GSAPOptions = {}
) {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      // Clear any existing animations
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Clear any existing ScrollTriggers
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      // Configure scroll trigger options
      const scrollTriggerOptions: ScrollTrigger.Vars = {
        trigger: element,
        start: options.start || 'top 80%',
        end: options.end || 'bottom 20%',
        markers: options.markers || false,
        scrub: options.scrub === true ? 1 : options.scrub || false,
        pin: options.pin || false,
        // anticipatePin: options.anticipatePin || false, // Entfernt wegen Typ-Fehler
        toggleActions: options.toggleActions || 'play none none none',
        ...((typeof options.scrollTrigger === 'object') ? options.scrollTrigger : {}),
      };

      // If scrollTrigger is enabled
      if (options.scrollTrigger) {
        if (options.fromVars && options.toVars) {
          // For from/to animations
          animationRef.current = gsap.fromTo(
            element, 
            { ...options.fromVars }, 
            { 
              ...options.toVars,
              duration: options.duration || 1, 
              delay: options.delay || 0,
              ease: options.ease || 'power2.out',
              scrollTrigger: scrollTriggerOptions,
            }
          );
        } else {
          // For standard animations
          animationRef.current = gsap.to(element, {
            ...options.animation,
            duration: options.duration || 1,
            delay: options.delay || 0,
            ease: options.ease || 'power2.out',
            scrollTrigger: scrollTriggerOptions,
          });
        }
        
        // Store the ScrollTrigger instance if possible
        if (animationRef.current?.scrollTrigger) {
          scrollTriggerRef.current = animationRef.current.scrollTrigger as ScrollTrigger;
        }
      } else if (options.fromVars && options.toVars) {
        // Regular fromTo animation without ScrollTrigger
        animationRef.current = gsap.fromTo(
          element,
          { ...options.fromVars },
          { 
            ...options.toVars,
            duration: options.duration || 1,
            delay: options.delay || 0,
            ease: options.ease || 'power2.out',
          }
        );
      } else if (options.animation) {
        // Regular animation without ScrollTrigger
        animationRef.current = gsap.to(element, {
          ...options.animation,
          duration: options.duration || 1,
          delay: options.delay || 0,
          ease: options.ease || 'power2.out',
        });
      }
    });

    return () => {
      ctx.kill(); // Clean up
    };
  }, [options]);

  return { elementRef, animation: animationRef.current, scrollTrigger: scrollTriggerRef.current };
}

export function useGSAPTimeline(
  options: {
    scrollTrigger?: ScrollTrigger.Vars | boolean;
    delay?: number;
    paused?: boolean;
  } = {}
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
  useEffect(() => {
    // Clear any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Clear any existing ScrollTriggers
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }
    
    const ctx = gsap.context(() => {
      // Create a new timeline
      const tl = gsap.timeline({
        delay: options.delay || 0,
        paused: options.paused || false,
        smoothChildTiming: true,
      });
      
      // If scrollTrigger is enabled
      if (options.scrollTrigger) {
        const scrollTriggerOptions = typeof options.scrollTrigger === 'object'
          ? options.scrollTrigger
          : {};
          
        // Create ScrollTrigger
        const st = ScrollTrigger.create({
          ...scrollTriggerOptions,
          animation: tl,
        });
        
        // Store the ScrollTrigger instance
        scrollTriggerRef.current = st;
      }
      
      timelineRef.current = tl;
    });
    
    return () => {
      ctx.kill(); // Clean up
    };
  }, [options]);
  
  return { timeline: timelineRef.current, scrollTrigger: scrollTriggerRef.current };
}