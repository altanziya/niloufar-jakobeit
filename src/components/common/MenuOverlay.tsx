'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = ['HOME', 'ABOUT', 'PROJECTS', 'GALLERY', 'PRESS', 'CONTACT'];

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  // Scroll Lock aktivieren – inkl. html + lenis-wrapper
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const lenisWrapper = document.querySelector('.lenis');

    if (isOpen) {
      html.style.overflow = 'hidden';
      body.classList.add('no-scroll');
      if (lenisWrapper) (lenisWrapper as HTMLElement).style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.classList.remove('no-scroll');
      if (lenisWrapper) (lenisWrapper as HTMLElement).style.overflow = '';
    }

    return () => {
      html.style.overflow = '';
      body.classList.remove('no-scroll');
      if (lenisWrapper) (lenisWrapper as HTMLElement).style.overflow = '';
    };
  }, [isOpen]);

  // Variants für konsistente Animationen
  const containerVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      x: '100%',
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
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
                     text-black dark:text-white hover:text-accent-500
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

          {/* Menüpunkt-Liste - verbessert mit mehr Platz */}
          <motion.nav className="w-full h-full flex items-center justify-center px-6 sm:px-10 md:px-16 py-16 sm:py-20">
            <motion.ul 
              className="flex flex-col items-center justify-center w-full max-w-3xl min-h-[60vh] space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10"
            >
              {menuItems.map((item, index) => (
                <motion.li
                  key={item}
                  className="overflow-hidden w-full text-center"
                  variants={itemVariants}
                >
                  <motion.a 
                    href={`#${item.toLowerCase()}`} 
                    className="inline-block py-2 sm:py-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                             font-serif tracking-wide cursor-pointer
                             text-neutral-900 dark:text-neutral-100
                             transition-transform duration-300 ease-out-expo"
                    whileHover={{
                      color: '#b69a7e',
                      scale: 1.05,
                      transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          {/* Decorative Elements */}
          <motion.div 
            className="absolute bottom-8 left-8 text-sm sm:text-base text-neutral-500 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
          >
            © My Sweet Home {new Date().getFullYear()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;