'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeaderProps {
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Hintergrund-Transparenz basierend auf Scroll-Position
  const headerBgOpacity = useTransform(
    scrollY, 
    [0, 100], 
    [0, 0.9]
  );

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', updateScrolled);
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);
  
  return (
    <motion.header 
      className={`fixed top-0 w-full z-40 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5
                ${scrolled ? 'backdrop-blur-sm' : ''}`}
      style={{
        backgroundColor: scrolled ? 'rgba(23, 23, 23, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.div
        className="text-base sm:text-lg md:text-xl font-serif tracking-wider cursor-pointer whitespace-nowrap overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ 
          color: '#b69a7e', 
          scale: 1.03, 
          transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] } 
        }}
      >
        NILOUFAR JAKOBEIT
      </motion.div>

      <motion.button
        onClick={onOpenMenu}
        className="bg-transparent border-0 font-serif uppercase tracking-widest text-base sm:text-lg md:text-xl cursor-pointer focus:outline-none"
        aria-label="Open menu"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        whileHover={{ 
          color: '#b69a7e', 
          scale: 1.05, 
          transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] } 
        }}
        whileTap={{ scale: 0.97 }}
      >
        • MENU
      </motion.button>
    </motion.header>
  );
};

export default Header;