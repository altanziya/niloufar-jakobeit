'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle({ 
  position = 'fixed', 
  className = '',
  showLabel = false,
  size = 'md'
}: { 
  position?: 'fixed' | 'absolute' | 'relative' | 'static'; 
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration Fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Size variations for icons and container
  const sizeClasses = {
    sm: {
      container: "p-1.5",
      icon: "w-4 h-4"
    },
    md: {
      container: "p-2",
      icon: "w-5 h-5"
    },
    lg: {
      container: "p-3",
      icon: "w-6 h-6"
    }
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    initial: { scale: 1 }
  };

  const iconVariants = {
    initial: { y: -20, opacity: 0, rotate: -90 },
    animate: { 
      y: 0, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.19, 1, 0.22, 1]
      }
    },
    exit: { 
      y: 20, 
      opacity: 0, 
      rotate: 90,
      transition: { 
        duration: 0.2, 
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };

  return (
    <motion.button
      aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
      className={`${position} z-50 ${sizeClasses[size].container} rounded-full 
                 bg-white/10 dark:bg-black/20 backdrop-blur-md 
                 border border-white/20 dark:border-white/10 
                 shadow-lg right-4 top-4
                 flex items-center gap-2
                 ${className}`}
      variants={buttonVariants}
      initial="initial"
      whileTap="tap"
      whileHover="hover"
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={sizeClasses[size].icon}
        >
          {theme === 'dark' ? (
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
      
      {showLabel && (
        <motion.span 
          className="text-sm font-medium hidden sm:inline-block"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </motion.span>
      )}
    </motion.button>
  );
}