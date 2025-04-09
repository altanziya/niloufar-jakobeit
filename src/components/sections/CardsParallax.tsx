'use client';

import { useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import Card from '@/components/common/Card';
import { CardsParallaxSectionProps } from '@/config/sections';
import styles from './CardsParallax.module.scss';
import Lenis from '@studio-freight/lenis';

const CardsParallax = ({ cards }: CardsParallaxSectionProps) => {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

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
    <main ref={container} className={styles.main}>
      {cards.map((card, i) => {
        const targetScale = 1 - ((cards.length - i) * 0.05);
        return (
          <Card 
            key={`card_${i}`}
            i={i}
            title={card.title}
            description={card.description}
            src={card.src}
            link={card.link}
            color={card.color}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </main>
  );
};

export default CardsParallax;