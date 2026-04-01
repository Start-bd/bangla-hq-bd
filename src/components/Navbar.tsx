import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const BanglaHQLogo = () => (
  <Link to="/" className="flex items-center gap-1 group">
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary font-display text-primary-foreground text-xl leading-none">B</span>
    <span className="font-heading font-bold text-foreground text-lg tracking-tight">angla</span>
    <span className="font-display text-primary text-lg">HQ</span>
    <span className="font-ui text-muted-foreground text-sm">.com</span>
  </Link>
);

const navLinks = [
  { to: "/directory", en: "Directory", bn: "ডিরেক্টরি" },
  { to: "/startups", en: "Startups", bn: "স্টার্টআপ" },
  { to: "/b2b", en: "B2B", bn: "B2B" },
  { to: "/news", en: "News", bn: "খবর" },
  { to: "/tools", en: "Tools", bn: "টুলস" },
];

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <BanglaHQLogo />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-ui font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {t(link.en, link.bn)}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-md text-xs font-ui font-medium border border-border hover:bg-accent transition-colors"
            >
              {lang === "en" ? "বাং" : "EN"}
            </button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">{t("Login", "লগইন")}</Link>
            </Button>
            <Button variant="amber" size="sm" asChild>
              <Link to="/onboarding">{t("Add Business", "ব্যবসা যোগ করুন")}</Link>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in-up">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-ui font-medium hover:bg-accent transition-colors"
                >
                  {t(link.en, link.bn)}
                  <span className="block text-xs text-muted-foreground font-bengali">{link.bn}</span>
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
                <button onClick={toggleLang} className="px-3 py-2 rounded-md text-sm font-ui border border-border">
                  {lang === "en" ? "বাংলা" : "English"}
                </button>
                <Button variant="ghost" size="sm" asChild className="flex-1">
                  <Link to="/auth/login">{t("Login", "লগইন")}</Link>
                </Button>
                <Button variant="amber" size="sm" asChild className="flex-1">
                  <Link to="/onboarding">{t("Add Business", "ব্যবসা যোগ করুন")}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
