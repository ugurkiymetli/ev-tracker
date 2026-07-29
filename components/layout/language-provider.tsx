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

export function LanguageProvider({
  initialLanguage = "en",
  children,
}: {
  initialLanguage?: string;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ev_tracker_lang") as Language;
      if (stored === "en" || stored === "tr") return stored;
    }
    return (initialLanguage as Language) || "en";
  });

  useEffect(() => {
    if (initialLanguage && (initialLanguage === "en" || initialLanguage === "tr")) {
      setLanguageState(initialLanguage as Language);
      if (typeof window !== "undefined") {
        localStorage.setItem("ev_tracker_lang", initialLanguage);
        document.cookie = `ev_tracker_lang=${initialLanguage}; path=/; max-age=31536000; SameSite=Lax`;
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
