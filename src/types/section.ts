import { HeroSectionProps, TextMaskSectionProps, CardsParallaxSectionProps } from '@/config/sections';

// Base section interface
export interface Section<T = any> {
  id: string;
  type: string;
  props: T;
}

// Section-specific interfaces for better type checking
export interface HeroSection extends Section<HeroSectionProps> {
  type: 'hero';
}

export interface TextMaskSection extends Section<TextMaskSectionProps> {
  type: 'textMask';
}

export interface CardsParallaxSection extends Section<CardsParallaxSectionProps> {
  type: 'cardsParallax';
}

// Type guard functions for type checking
export function isHeroSection(section: Section): section is HeroSection {
  return section.type === 'hero';
}

export function isTextMaskSection(section: Section): section is TextMaskSection {
  return section.type === 'textMask';
}

export function isCardsParallaxSection(section: Section): section is CardsParallaxSection {
  return section.type === 'cardsParallax';
}