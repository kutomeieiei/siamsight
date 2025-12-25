
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import { Locale } from '../types';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === 'th') {
      document.body.classList.add('font-thai');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-thai');
    }
  }, [locale]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[locale];

    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            return key; // Return the key itself if not found
        }
    }

    if (typeof result === 'string' && replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            result = result.replace(`{{${key}}}`, String(value));
        });
    }

    return result || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
