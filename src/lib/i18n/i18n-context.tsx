'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import translation files
import mrTranslations from './translations/mr.json';
import enTranslations from './translations/en.json';

export type Language = 'mr' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  mr: mrTranslations,
  en: enTranslations,
};

// Helper function to get nested translation value
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

// Helper function to replace parameters in translation
function replaceParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('mr');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'mr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    return replaceParams(translation, params);
  };

  // RTL support (currently not needed for Marathi/English, but prepared for future)
  const isRTL = false;

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isRTL,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Hook for getting current language
export function useLanguage() {
  const { language, setLanguage } = useTranslation();
  return { language, setLanguage };
}

// Hook for getting translation function
export function useT() {
  const { t } = useTranslation();
  return t;
}