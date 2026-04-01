import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";

const footerLinks = {
  browse: {
    title_en: "Browse", title_bn: "ব্রাউজ করুন",
    links: [
      { to: "/directory", en: "Business Directory", bn: "ব্যবসার ডিরেক্টরি" },
      { to: "/directory/it-software", en: "IT Companies", bn: "আইটি কোম্পানি" },
      { to: "/directory/restaurant", en: "Restaurants", bn: "রেস্তোরাঁ" },
      { to: "/startups", en: "Startups", bn: "স্টার্টআপ" },
      { to: "/b2b", en: "B2B Marketplace", bn: "B2B মার্কেটপ্লেস" },
    ],
  },
  forBiz: {
    title_en: "For Business", title_bn: "ব্যবসার জন্য",
    links: [
      { to: "/onboarding", en: "Add Your Business", bn: "ব্যবসা যোগ করুন" },
      { to: "/pricing", en: "Pricing Plans", bn: "প্ল্যান ও মূল্য" },
      { to: "/tools", en: "Business Tools", bn: "ব্যবসার টুলস" },
      { to: "/news", en: "Business News", bn: "ব্যবসার খবর" },
    ],
  },
  ecosystem: {
    title_en: "StartBD Ecosystem", title_bn: "StartBD ইকোসিস্টেম",
    links: [
      { to: "https://bdai.ai", en: "BdAi.ai", bn: "BdAi.ai", external: true },
      { to: "https://bdaihub.com", en: "BdAiHub", bn: "BdAiHub", external: true },
      { to: "https://banglaseo.com", en: "BanglaSEO", bn: "বাংলাSEO", external: true },
      { to: "https://meetbd.com", en: "MeetBD", bn: "মিটবিডি", external: true },
      { to: "https://workersbd.com", en: "WorkersBD", bn: "ওয়ার্কার্সবিডি", external: true },
    ],
  },
  company: {
    title_en: "Company", title_bn: "কোম্পানি",
    links: [
      { to: "/about", en: "About BanglaHQ", bn: "BanglaHQ সম্পর্কে" },
      { to: "/pricing", en: "Pricing", bn: "মূল্য" },
      { to: "mailto:hello@banglahq.com", en: "Contact Us", bn: "যোগাযোগ", external: true },
    ],
  },
};

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary font-display text-primary-foreground text-lg leading-none">B</span>
              <span className="font-heading font-bold text-foreground">angla</span>
              <span className="font-display text-primary">HQ</span>
            </div>
            <p className="text-xs text-muted-foreground font-bengali leading-relaxed">
              বাংলাদেশের ব্যবসার সদর দফতর
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Bangladesh's Business Headquarters
            </p>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title_en}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                {t(section.title_en, section.title_bn)}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  const content = (
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {t(link.en, link.bn)}
                    </span>
                  );
                  return (
                    <li key={link.to}>
                      {"external" in link && link.external ? (
                        <a href={link.to} target="_blank" rel="noopener noreferrer">{content}</a>
                      ) : (
                        <Link to={link.to}>{content}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ in Mymensingh, Bangladesh 🇧🇩
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 BanglaHQ.com — বাংলাদেশের ব্যবসার সদর দফতর
          </p>
          <p className="text-xs text-muted-foreground">
            Interested in BanglaHQ? hello@banglahq.com
          </p>
        </div>
      </div>
    </footer>
  );
}
