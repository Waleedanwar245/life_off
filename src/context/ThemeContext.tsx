'use client';

import React, { createContext, useContext, useLayoutEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  // keep a toggle to satisfy types, but it's a no-op if you truly want to lock to light
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme] = useState<Theme>('light'); // always light

  // Ensure <html> has no dark class before paint
  useLayoutEffect(() => {
    try {
      document.documentElement.classList.remove('dark');
      // optionally persist 'light' so other parts read it
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    // no-op (or you can console.warn('Theme locked to light'))
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
