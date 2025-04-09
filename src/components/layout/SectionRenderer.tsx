'use client';
import { useState, useCallback } from 'react';
import { Section } from '@/types/section';
import { SectionComponents } from '@/config/sectionRegistry';
import ParallaxSectionTransition from '@/components/transitions/ParallaxSectionTransition';

interface SectionRendererProps {
  sections: Section[];
  useParallaxTransition?: boolean;
}

const SectionRenderer = ({
  sections,
  useParallaxTransition = true
}: SectionRendererProps) => {
  const [textMaskAnimationTrigger, setTextMaskAnimationTrigger] = useState(false);
  
  // Callback for triggering TextMask animations
  const triggerTextMaskAnimations = useCallback(() => {
    setTextMaskAnimationTrigger(true);
  }, []);
  
  // If we have less than 2 sections or parallax is disabled, render normally
  if (!sections || sections.length < 2 || !useParallaxTransition) {
    return (
      <>
        {sections?.map((section) => {
          if (!section || !section.type) {
            console.warn('Invalid section configuration', section);
            return null;
          }
          
          const SectionComponent = SectionComponents[section.type];
          
          if (!SectionComponent) {
            console.warn(`Section component for type "${section.type}" not found in registry.`);
            return null;
          }
          
          // Special case for TextMask section
          if (section.type === 'textMask') {
            return (
              <div key={section.id || `section-${Math.random()}`} id={section.id}>
                <SectionComponent {...(section.props || {})} forceAnimation={textMaskAnimationTrigger} />
              </div>
            );
          }
          
          return (
            <div key={section.id || `section-${Math.random()}`} id={section.id}>
              <SectionComponent {...(section.props || {})} />
            </div>
          );
        })}
      </>
    );
  }
  
  // For parallax transition, render the first two sections with ParallaxSectionTransition,
  // and the remaining sections normally
  const firstSectionProps = sections[0];
  const secondSectionProps = sections[1];
  const remainingSections = sections.slice(2);
  
  if (!firstSectionProps?.type || !secondSectionProps?.type) {
    console.warn('Invalid section configuration');
    return null;
  }
  
  const FirstSectionComponent = SectionComponents[firstSectionProps.type];
  const SecondSectionComponent = SectionComponents[secondSectionProps.type];
  
  if (!FirstSectionComponent || !SecondSectionComponent) {
    console.warn('One or both section components not found in registry.');
    return null;
  }
  
  const firstSection = <FirstSectionComponent {...(firstSectionProps.props || {})} />;
  const secondSection = <SecondSectionComponent
    {...(secondSectionProps.props || {})}
    forceAnimation={secondSectionProps.type === 'textMask' ? textMaskAnimationTrigger : undefined}
  />;
  
  return (
    <>
      <div className="bg-[#f8f7f5]"> {/* Off-White statt bg-neutral-900 */}
        <ParallaxSectionTransition
          firstSection={firstSection}
          secondSection={secondSection}
          bgColor="#f8f7f5"
          triggerAnimations={true}
          onAnimationTriggered={triggerTextMaskAnimations}
        />
      </div>
      
      {/* Render remaining sections normally */}
      {remainingSections.map((section) => {
        if (!section || !section.type) {
          console.warn('Invalid section configuration', section);
          return null;
        }
        
        const SectionComponent = SectionComponents[section.type];
        
        if (!SectionComponent) {
          console.warn(`Section component for type "${section.type}" not found in registry.`);
          return null;
        }
        
        return (
          <div key={section.id || `section-${Math.random()}`} id={section.id} className="bg-[#f8f7f5]"> {/* Off-White statt bg-neutral-900 */}
            <SectionComponent {...(section.props || {})} />
          </div>
        );
      })}
    </>
  );
};

export default SectionRenderer;