"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key] || key,
});

export function detectBrowserLanguage(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ev_tracker_lang") as Language;
    if (stored === "en" || stored === "tr") return stored;

    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (browserLang && browserLang.toLowerCase().startsWith("tr")) {
      return "tr";
    }
  }
  return "en";
}

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage?: string;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage === "en" || initialLanguage === "tr") {
      return initialLanguage as Language;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ev_tracker_lang") as Language;
      if (stored === "en" || stored === "tr") return stored;
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (initialLanguage === "en" || initialLanguage === "tr") {
        setLanguageState(initialLanguage as Language);
        localStorage.setItem("ev_tracker_lang", initialLanguage);
        document.cookie = `ev_tracker_lang=${initialLanguage}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        const stored = localStorage.getItem("ev_tracker_lang") as Language;
        if (stored === "en" || stored === "tr") {
          setLanguageState(stored);
          document.cookie = `ev_tracker_lang=${stored}; path=/; max-age=31536000; SameSite=Lax`;
        } else {
          const detected = detectBrowserLanguage();
          setLanguageState(detected);
          localStorage.setItem("ev_tracker_lang", detected);
          document.cookie = `ev_tracker_lang=${detected}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }
    }
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ev_tracker_lang", lang);
      document.cookie = `ev_tracker_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
