'use client';

import React, { useEffect, useState, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLenis } from '@/components/providers/LenisProvider';

// Navigation links with image sources
const menuItems = [
  { title: "HOME", href: "/", src: "interior1.jpg" },
  { title: "ABOUT", href: "/about", src: "interior2.jpg" },
  { title: "PROJECTS", href: "/projects", src: "interior3.jpg" },
  { title: "GALLERY", href: "/gallery", src: "interior4.jpg" },
  { title: "PRESS", href: "/press", src: "interior5.jpg" },
  { title: "CONTACT", href: "/contact", src: "interior1.jpg" }
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Container animation - Von oben
const containerVariants = {
  hidden: { y: '-100%', opacity: 1 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.76, 0, 0.24, 1],
      staggerChildren: 0.07
    }
  },
  exit: { 
    y: '-100%',
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

// Character animation for split text
const translate = {
  initial: {
    y: "100%",
    opacity: 0
  },
  visible: (i: number[]) => ({
    y: 0,
    opacity: 1,
    transition: { 
      duration: 1, 
      ease: [0.76, 0, 0.24, 1], 
      delay: i[0] 
    }
  }),
  exit: (i: number[]) => ({
    y: "100%",
    opacity: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.76, 0, 0.24, 1], 
      delay: i[1] 
    }
  })
};

// Opacity animation for image reveal
const opacity = {
  initial: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.35 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35 }
  }
};

// Verbesserte Blur-Animation
const blur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1
  },
  open: {
    filter: "blur(4px)",
    opacity: 0.6,
    scale: 0.98,
    transition: { duration: 0.3 }
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  // State for image hover effect
  const [selectedLink, setSelectedLink] = useState({ isActive: false, index: 0 });
  const { lenis } = useLenis();
  const savedScrollPosition = useRef<number>(0);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Speichern der aktuellen Scrollposition
      savedScrollPosition.current = window.scrollY;
      
      // Lenis anhalten, damit keine neuen Scroll-Events ausgelöst werden
      if (lenis) {
        lenis.stop();
      }
      
      // HTML und Body als fixed setzen, um jeden Scroll zu verhindern
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.top = `-${savedScrollPosition.current}px`;
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflowY = 'scroll';
      document.body.classList.add('no-scroll');
    } else {
      // Lenis wieder starten
      if (lenis) {
        lenis.start();
      }
      
      // Fixed-Positioning entfernen und zur gespeicherten Position scrollen
      document.documentElement.style.position = '';
      document.documentElement.style.top = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflowY = '';
      document.body.classList.remove('no-scroll');
      
      // Explizit zur gespeicherten Position zurückscrollen
      window.scrollTo(0, savedScrollPosition.current);
    }
    
    return () => {
      // Cleanup
      document.documentElement.style.position = '';
      document.documentElement.style.top = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflowY = '';
      document.body.classList.remove('no-scroll');
      
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen, lenis]);

  // Split text into characters for animation
  const getChars = (word: string): React.ReactNode[] => {
    const chars: React.ReactNode[] = [];
    word.split("").forEach((char: string, i: number) => {
      chars.push(
        <motion.span 
          custom={[i * 0.02, (word.length - i) * 0.01]} 
          variants={translate} 
          key={char + i}
          className="inline-block"
        >
          {char}
        </motion.span>
      );
    });
    return chars;
  };

  // Prevent default behavior on link clicks
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Verzögerter Aufruf, damit das Menü erst komplett schließen kann
    setTimeout(() => {
      onClose();
    }, 50);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Main Menu Overlay */}
          <motion.div 
            ref={overlayContainerRef}
            className="fixed inset-0 z-50 bg-[#f9f6f1] dark:bg-neutral-900 flex items-center justify-center overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              willChange: 'transform',
              overscrollBehavior: 'none',
              height: '100dvh',
            }}
          >
            {/* Close Button */}
            <motion.button 
              onClick={onClose}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 md:right-8 lg:right-10 
                       bg-transparent border-0 font-serif uppercase tracking-widest
                       text-lg sm:text-xl md:text-2xl cursor-pointer
                       text-black dark:text-white hover:text-[#b69a7e]
                       transition-colors duration-300 z-50"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              • CLOSE
            </motion.button>

            {/* Main Menu Content */}
            <div className="w-full h-full flex flex-col items-center justify-between px-6 sm:px-10 md:px-16 py-16 sm:py-20">
              {/* Menu Links */}
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                {/* Menu Items with Character Split Animation */}
                <div className="flex flex-col items-center md:items-start justify-center w-full">
                  <ul className="flex flex-col items-center md:items-start justify-center w-full max-w-3xl space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.title}
                        className="overflow-visible w-full text-center md:text-left"
                        variants={opacity}
                      >
                        <Link 
                          href={item.href} 
                          onClick={handleLinkClick}
                          className="block py-2 sm:py-3 overflow-visible"
                        >
                          <motion.div 
                            onMouseOver={() => setSelectedLink({ isActive: true, index })} 
                            onMouseLeave={() => setSelectedLink({ isActive: false, index })} 
                            variants={blur} 
                            animate={selectedLink.isActive && selectedLink.index !== index ? "open" : "closed"}
                            className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                                     font-serif tracking-wide cursor-pointer overflow-visible
                                     text-neutral-900 dark:text-neutral-100"
                            whileHover={{
                              color: '#b69a7e',
                              scale: 1.05,
                              transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] }
                            }}
                          >
                            {getChars(item.title)}
                          </motion.div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Image Component */}
                <motion.div 
                  variants={opacity} 
                  initial="initial" 
                  animate={selectedLink.isActive ? "visible" : "initial"}
                  exit="exit"
                  className="hidden md:block w-[900px] h-[800px] relative"
                  style={{ willChange: "opacity" }}
                >
                  {selectedLink.isActive && (
                    <div className="w-full h-full relative rounded-lg overflow-hidden">
                      <Image 
                        src={`/images/${menuItems[selectedLink.index].src}`}
                        alt="Menu image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 0px, 700px"
                        priority={true}
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Footer Section */}
              <div className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-sm text-neutral-900 dark:text-neutral-100 uppercase w-full">
                <div>
                  <div className="overflow-hidden">
                    <motion.div
                      custom={[0.3, 0]} 
                      variants={translate} 
                    >
                      <span className="text-[#b69a7e]/70 block">Made by:</span>
                      <span>YB Studios</span>
                    </motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="overflow-hidden">
                    <motion.div
                      custom={[0.5, 0]} 
                      variants={translate} 
                    >
                      <span className="text-[#b69a7e]/70 block">Contact:</span>
                      <span>01805 4646 - info@mysweethome-shop.de</span>
                    </motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="overflow-hidden">
                    <motion.div
                      custom={[0.6, 0]} 
                      variants={translate} 
                    >
                      <span className="block mb-2">Privacy Policy</span>
                      <span>Terms & Conditions</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Black overlay */}
          <motion.div 
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;