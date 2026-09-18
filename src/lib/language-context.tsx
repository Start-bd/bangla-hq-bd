import React, { createContext, useContext, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (en: string, bn: string) => string;
  localizePath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (en) => en,
  localizePath: (path) => path,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const lang: Language = location.pathname === "/bn" || location.pathname.startsWith("/bn/") ? "bn" : "en";
  const localizePath = useCallback((path: string) => {
    if (!path.startsWith("/") || path.startsWith("/auth/") || path === "/dashboard" || path === "/onboarding") return path;
    const withoutLocale = path === "/bn" ? "/" : path.replace(/^\/bn(?=\/|$)/, "") || "/";
    return lang === "bn" ? (withoutLocale === "/" ? "/bn/" : `/bn${withoutLocale}`) : withoutLocale;
  }, [lang]);
  const toggleLang = useCallback(() => {
    const withoutLocale = location.pathname === "/bn" ? "/" : location.pathname.replace(/^\/bn(?=\/|$)/, "") || "/";
    const nextPath = lang === "en" ? (withoutLocale === "/" ? "/bn/" : `/bn${withoutLocale}`) : withoutLocale;
    navigate(`${nextPath}${location.search}${location.hash}`);
  }, [lang, location.hash, location.pathname, location.search, navigate]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const t = useCallback((en: string, bn: string) => (lang === "en" ? en : bn), [lang]);
  return <LanguageContext.Provider value={{ lang, toggleLang, t, localizePath }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
