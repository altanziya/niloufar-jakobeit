'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
  systemTheme: 'dark' | 'light';
  isSystemTheme: boolean;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  // Resolve the theme based on current settings
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isSystemTheme = theme === 'system';

  // Apply theme to DOM
  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Set color-scheme for automatic scrollbar colors
    document.documentElement.style.colorScheme = newTheme;
  };

  // Watch system theme changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    
    const detectSystemTheme = () => {
      const isDark = media.matches;
      setSystemTheme(isDark ? 'dark' : 'light');
      
      if (theme === 'system') {
        applyTheme(isDark ? 'dark' : 'light');
      }
    };
    
    // Initial detection
    detectSystemTheme();
    
    // Listen for changes
    const listener = () => detectSystemTheme();
    media.addEventListener('change', listener);
    
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [theme]);

  // Initialize from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    setMounted(true);
  }, [storageKey]);

  // Effect to apply theme changes
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === 'system') {
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme, systemTheme, mounted]);

  // Set theme and save to localStorage
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme, 
    systemTheme,
    isSystemTheme
  };

  // Avoid hydration issues by not rendering until mounted
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};