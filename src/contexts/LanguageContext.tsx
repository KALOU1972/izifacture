"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/locales/en";
import { fr } from "@/locales/fr";

type Language = "en" | "fr";
type Dictionary = typeof fr; // the structure is the same

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr"); // Default to french
  
  // Load saved preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("izifacture_language") as Language;
    if (savedLang === "en" || savedLang === "fr") {
      setTimeout(() => setLanguageState(savedLang), 0);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("izifacture_language", lang);
  };

  const t = language === "en" ? en : fr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
