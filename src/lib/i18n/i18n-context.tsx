'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import translation files
import mrTranslations from './translations/mr.json';
import enTranslations from './translations/en.json';

type Language = 'mr' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  mr: mrTranslations,
  en: enTranslations,
};

// Helper function to get nested translation value
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj);
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('mr');
  const [isRTL, setIsRTL] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'mr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Update RTL based on language
  useEffect(() => {
    setIsRTL(language === 'mr');
    document.documentElement.dir = language === 'mr' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    const translation = getNestedValue(translations[language], key);
    return translation || key;
  };

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isRTL,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
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