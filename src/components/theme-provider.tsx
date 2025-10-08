'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeSettings, defaultTheme, applyTheme, getStoredTheme, initializeTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  applyThemeColors: (colors: ThemeSettings['colors']) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    // Initialize theme on mount
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      initializeTheme();
    }
  }, []);

  const setTheme = (newTheme: ThemeSettings) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const applyThemeColors = (colors: ThemeSettings['colors']) => {
    const updatedTheme = {
      ...theme,
      colors
    };
    setTheme(updatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
