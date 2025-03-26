'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Image animation variants
const imageAnimations = {
  fadeIn: {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.97
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  }
};

// Text animation variants
const textAnimations = {
  staggerItems: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.12,
          delayChildren: 0.1
        }
      }
    },
    item: {
      hidden: { 
        opacity: 0, 
        y: 25
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.61, 0.355, 1]
        }
      }
    }
  }
};

interface AboutProps {
  forceAnimation?: boolean;
}

const About = ({ forceAnimation = false }: AboutProps) => {
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
      className="relative min-h-screen w-full flex items-center bg-neutral-900"
    >
      {/* Leichter Hintergrund-Gradient für Tiefe */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/5" />
      
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={textAnimations.staggerItems.container}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
          >
            <motion.h2 
              variants={textAnimations.staggerItems.item}
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-8 text-[#b69a7e]"
            >
              Über uns
            </motion.h2>
            
            <motion.p 
              variants={textAnimations.staggerItems.item}
              className="text-xl md:text-2xl mb-6 text-[#b69a7e]"
            >
              My Sweet Home steht für zeitloses Design und außergewöhnliche Wohnkonzepte.
            </motion.p>
            
            <motion.p 
              variants={textAnimations.staggerItems.item}
              className="text-lg md:text-xl mb-6 text-[#b69a7e]"
            >
              Seit über 10 Jahren gestalten wir Räume, die nicht nur ästhetisch ansprechend sind, sondern auch die Persönlichkeit und den Lebensstil unserer Kunden widerspiegeln.
            </motion.p>
            
            <motion.p 
              variants={textAnimations.staggerItems.item}
              className="text-lg md:text-xl mb-8 text-[#b69a7e]"
            >
              Besuchen Sie unsere Concept Stores in Frankfurt, Wiesbaden und Dreieich, um unsere Designphilosophie zu erleben.
            </motion.p>
            
            <motion.div variants={textAnimations.staggerItems.item}>
              <button className="px-8 py-4 border-2 border-[#b69a7e] text-[#b69a7e] hover:bg-[#b69a7e] hover:text-neutral-900 transition duration-300 text-lg">
                Mehr erfahren
              </button>
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div
            className="relative aspect-[4/5] w-full"
            variants={imageAnimations.fadeIn}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/images/interior8.jpg"
                alt="Interior design concept"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;