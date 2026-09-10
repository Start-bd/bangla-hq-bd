import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (en) => en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "bn" : "en")), []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const t = useCallback((en: string, bn: string) => (lang === "en" ? en : bn), [lang]);
  return <LanguageContext.Provider value={{ lang, toggleLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
