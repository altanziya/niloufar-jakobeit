'use client';

import { useEffect, useState, useCallback } from 'react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import ParallaxSectionTransition from '@/components/transitions/ParallaxSectionTransition';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aboutAnimationTrigger, setAboutAnimationTrigger] = useState(false);

  // Seite als geladen markieren
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Callback für die Auslösung der About-Animationen
  const triggerAboutAnimations = useCallback(() => {
    setAboutAnimationTrigger(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="bg-neutral-900">
      {/* Hero zu About mit Parallaxtransition - exakt wie beschrieben */}
      <ParallaxSectionTransition
        firstSection={<Hero />}
        secondSection={<About forceAnimation={aboutAnimationTrigger} />}
        bgColor="#191919"
        triggerAnimations={triggerAboutAnimations}
      />
    </div>
  );
}