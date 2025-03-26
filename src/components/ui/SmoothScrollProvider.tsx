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

interface SmoothScrollProviderProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  };
}

export default function SmoothScrollProvider({ 
  children,
  options
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  
  // Default options with cubic-bezier easing
  const defaultOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    orientation: 'vertical' as const,
    gestureOrientation: 'vertical' as const,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  useEffect(() => {
    // Initialize lenis for smooth scrolling
    if (typeof window !== 'undefined') {
      lenisRef.current = new Lenis(mergedOptions);
      
      // Add lenis-smooth class to html element
      document.documentElement.classList.add('lenis-smooth');
      
      // Sync with RAF (Request Animation Frame)
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      
      // Start the animation loop
      const animationId = requestAnimationFrame(raf);
      
      return () => {
        // Clean up
        document.documentElement.classList.remove('lenis-smooth');
        lenisRef.current?.destroy();
        cancelAnimationFrame(animationId);
      };
    }
  }, [mergedOptions]);
  
  // Integration with route changes for Next.js App Router
  useEffect(() => {
    // Scroll to top when changing routes
    const handleRouteChange = () => {
      lenisRef.current?.scrollTo(0, { immediate: true });
    };
    
    // Use for Next.js route changes
    window.addEventListener('navigateto', handleRouteChange);
    
    return () => {
      window.removeEventListener('navigateto', handleRouteChange);
    };
  }, []);
  
  // Utility function to scroll to elements
  const scrollTo = (target: string | HTMLElement | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };
  
  // Provide lenis instance and scrollTo utility to children components
  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}