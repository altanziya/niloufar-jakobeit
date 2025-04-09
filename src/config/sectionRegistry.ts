import { ComponentType } from 'react';
import Hero from '@/components/sections/Hero';
import TextMask from '@/components/sections/TextMask';
import CardsParallax from '@/components/sections/CardsParallax';

// Registry of all section components
export const SectionComponents: Record<string, ComponentType<any>> = {
  hero: Hero,
  textMask: TextMask,
  cardsParallax: CardsParallax,
  // Add more section components as needed
};