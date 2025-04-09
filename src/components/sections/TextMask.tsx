'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import TextMaskScroll from '@/components/transitions/TextMaskScroll';
import { TextMaskSectionProps } from '@/config/sections';

const TextMask = ({ forceAnimation = false }: TextMaskSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Kombinierte Animation-Trigger
  useEffect(() => {
    if (forceAnimation || isInView) {
      setShouldAnimate(true);
    }
  }, [forceAnimation, isInView]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-neutral-900"
    >
      {/* TextMaskScroll-Animation */}
      <TextMaskScroll triggerOnVisible={shouldAnimate} />
    </section>
  );
};

export default TextMask;