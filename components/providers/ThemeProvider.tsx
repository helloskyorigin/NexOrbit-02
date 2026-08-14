'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nexorbit_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<ThemeMode>('light');
  const isDark = false;

  useEffect(() => {
    // Force remove 'dark' class from document element and lock localstorage to light
    document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } catch {
      // ignore
    }
  }, []);

  const setTheme = () => {
    // Lock to light mode, no-op for dark mode switches
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as ThemeMode,
      setTheme: () => {},
      isDark: false,
    };
  }
  return context;
};
