'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to smoothly scroll to an element by ID
 * @param targetId ID of the element to scroll to
 * @returns Function to trigger scrolling
 */
export function useSmoothScroll(targetId: string) {
  const scrollToElement = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return scrollToElement;
}

/**
 * Hook to get and track window dimensions
 * @returns Current window width and height
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to track scroll position
 * @returns Current scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleScroll() {
      setScrollPosition(window.scrollY);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on first render

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Hook to detect if an element is in the viewport
 * @param ref Reference to the element
 * @param margin Margin to extend the detection area
 * @returns Boolean indicating if element is in viewport
 */
export function useInView(ref: React.RefObject<HTMLElement>, margin = '0px') {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: margin }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, margin]);

  return isInView;
}