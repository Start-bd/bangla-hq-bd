import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight, Zap, Globe, Shield, TrendingUp } from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import { categories, divisions, ecosystemTools } from "@/lib/mock-data";
import { useBusinesses, useBusinessStats } from "@/hooks/use-businesses";

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const quickSearchChips = [
  { en: "IT Company", bn: "আইটি কোম্পানি" },
  { en: "Restaurant", bn: "রেস্তোরাঁ" },
  { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
  { en: "Education", bn: "শিক্ষা" },
  { en: "Garments", bn: "পোশাক শিল্প" },
  { en: "Construction", bn: "নির্মাণ" },
  { en: "Real Estate", bn: "রিয়েল এস্টেট" },
  { en: "Finance", bn: "আর্থিক সেবা" },
];

export default function Index() {
  const { t } = useLanguage();
  const { data: featuredBusinesses = [] } = useBusinesses({ featured: true, limit: 6 });
  const { data: startups = [] } = useBusinesses({ startup: true, limit: 3 });
  const { data: stats } = useBusinessStats();

  const statsData = [
    { value: stats?.total ?? 8450, en: "Businesses Listed", bn: "ব্যবসা তালিকাভুক্ত" },
    { value: stats?.districts ?? 64, en: "Districts Covered", bn: "জেলা অন্তর্ভুক্ত" },
    { value: stats?.verified ?? 1240, en: "Verified Companies", bn: "যাচাইকৃত কোম্পানি" },
    { value: stats?.connections ?? 3800, en: "B2B Connections", bn: "B2B সংযোগ" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative grid-pattern py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-sm font-ui font-medium text-secondary mb-4">
            🇧🇩 {t("Bangladesh's Official Business Directory", "বাংলাদেশের আনুষ্ঠানিক ব্যবসার ডিরেক্টরি")}
          </p>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
            {t("Find Any Business.", "যেকোনো ব্যবসা খুঁজুন।")}
            <br />
            <span className="text-gradient-amber">{t("In Bangladesh.", "বাংলাদেশে।")}</span>
          </h1>
          <p className="font-bengali text-xl md:text-2xl text-muted-foreground mt-3">
            {t("বাংলাদেশের যেকোনো ব্যবসা খুঁজুন।", "Find any business in Bangladesh.")}
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto font-body">
            {t(
              "8 million+ Bangladeshi businesses. Find verified suppliers, service providers, and partners — by category, district, and industry.",
              "৮ মিলিয়ন+ বাংলাদেশি ব্যবসা। ক্যাটাগরি, জেলা ও শিল্প অনুযায়ী যাচাইকৃত সরবরাহকারী ও সেবা প্রদানকারী খুঁজুন।"
            )}
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row bg-card rounded-xl border border-border shadow-warm overflow-hidden">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-border">
                <Search size={20} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t("Search businesses or services...", "ব্যবসা বা সেবা খুঁজুন...")}
                  className="w-full px-3 py-4 bg-transparent text-foreground font-ui focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center px-4 border-b md:border-b-0 md:border-r border-border">
                <MapPin size={18} className="text-muted-foreground flex-shrink-0" />
                <select className="px-2 py-4 bg-transparent text-foreground font-ui focus:outline-none cursor-pointer">
                  <option>{t("All Bangladesh", "সারা বাংলাদেশ")}</option>
                  {divisions.map((d) => (
                    <option key={d.name_en}>{t(d.name_en, d.name_bn)}</option>
                  ))}
                </select>
              </div>
              <Button variant="amber" className="m-2 md:m-1.5 rounded-lg h-auto py-3 px-6">
                {t("Search", "খুঁজুন")}
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {quickSearchChips.map((chip) => (
                <Link
                  key={chip.en}
                  to={`/directory`}
                  className="px-3 py-1.5 rounded-full text-xs font-ui bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {t(chip.en, chip.bn)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-8 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsData.map((stat) => (
              <div key={stat.en}>
                <p className="font-display text-3xl md:text-4xl text-primary">
                  <CountUp target={stat.value} />+
                </p>
                <p className="text-sm text-muted-foreground font-ui mt-1">{t(stat.en, stat.bn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              {t("Popular Categories", "জনপ্রিয় ক্যাটাগরি")}
            </h2>
            <p className="font-bengali text-muted-foreground mt-1">
              {t("ক্যাটাগরি অনুযায়ী ব্যবসা খুঁজুন", "Browse businesses by category")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/directory`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-card transition-all group text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-bengali font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.name_bn}
                </span>
                <span className="text-xs text-muted-foreground font-ui">{cat.name_en}</span>
                <span className="text-xs font-data text-primary">{cat.count.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
                <Shield size={24} className="text-secondary" />
                {t("Verified Businesses", "যাচাইকৃত ব্যবসা")}
              </h2>
              <p className="font-bengali text-sm text-muted-foreground mt-1">
                {t("বাংলাদেশের শীর্ষ যাচাইকৃত কোম্পানি", "Top verified companies in Bangladesh")}
              </p>
            </div>
            <Button variant="amber-outline" size="sm" asChild>
              <Link to="/directory">{t("View All", "সব দেখুন")} <ArrowRight size={14} /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              {t("Browse by Division", "বিভাগ অনুযায়ী খুঁজুন")}
            </h2>
            <p className="font-bengali text-muted-foreground mt-1">
              {t("বাংলাদেশের ৮ বিভাগের ব্যবসা", "Businesses across Bangladesh's 8 divisions")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {divisions.map((div) => (
              <Link
                key={div.name_en}
                to="/directory"
                className="p-5 rounded-lg bg-card border border-border hover:border-secondary hover:shadow-card transition-all group text-center"
              >
                <p className="font-bengali font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                  {div.name_bn}
                </p>
                <p className="text-sm text-muted-foreground font-ui">{div.name_en}</p>
                <p className="text-xs font-data text-primary mt-2">{div.count.toLocaleString()}+ {t("businesses", "ব্যবসা")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STARTUP SPOTLIGHT */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
                <Zap size={24} className="text-primary" />
                {t("Bangladesh Startups", "বাংলাদেশের স্টার্টআপ")}
              </h2>
              <p className="font-bengali text-sm text-muted-foreground mt-1">
                {t("উদীয়মান বাংলাদেশি স্টার্টআপ", "Emerging Bangladeshi startups")}
              </p>
            </div>
            <Button variant="amber-outline" size="sm" asChild>
              <Link to="/startups">{t("See All", "সব দেখুন")} <ArrowRight size={14} /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {startups.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM TOOLS */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              {t("Tools for Your Business", "আপনার ব্যবসার জন্য টুলস")}
            </h2>
            <p className="font-bengali text-muted-foreground mt-1">
              {t("বাংলাদেশি ব্যবসার জন্য প্রয়োজনীয় টুলস", "Essential tools for Bangladeshi businesses")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ecosystemTools.map((tool) => (
              <a
                key={tool.slug}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg bg-card border-2 border-primary/20 hover:border-primary hover:shadow-card transition-all group text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 font-heading font-bold text-primary text-lg">
                  {tool.name.slice(0, 2)}
                </div>
                <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</p>
                <p className="text-xs text-muted-foreground font-ui mt-1">{tool.tagline}</p>
                <span className="inline-flex items-center gap-1 text-xs text-secondary font-ui mt-2">
                  🇧🇩 Made in Bangladesh
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bengali font-semibold text-2xl md:text-3xl text-primary-foreground">
            আপনার ব্যবসাটি BanglaHQ-তে যোগ করুন
          </h2>
          <p className="font-bengali text-primary-foreground/80 mt-3 max-w-xl mx-auto">
            {t(
              "Create your free business profile — millions of customers will find you.",
              "বিনামূল্যে আপনার ব্যবসার প্রোফাইল তৈরি করুন — লক্ষ লক্ষ গ্রাহক খুঁজে পাবেন।"
            )}
          </p>
          <Button variant="hero-white" className="mt-6" asChild>
            <Link to="/onboarding">
              {t("Add Your Business Free", "বিনামূল্যে যোগ করুন")} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
