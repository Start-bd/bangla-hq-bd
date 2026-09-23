import { useLanguage } from "@/lib/language-context";
import PublicSeo from "@/components/PublicSeo";
import { Helmet } from "react-helmet-async";
import { ecosystemTools } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";

const extraTools = [
  { name: "Google Analytics", tagline: "Track website traffic", category: "SEO & Marketing", url: "https://analytics.google.com", bd: false },
  { name: "Facebook Ads", tagline: "Reach BD customers", category: "SEO & Marketing", url: "https://business.facebook.com", bd: false },
  { name: "Bdjobs", tagline: "Job portal for Bangladesh", category: "HR & Recruitment", url: "https://bdjobs.com", bd: false },
  { name: "bKash Business", tagline: "Accept mobile payments", category: "Finance", url: "https://bkash.com", bd: false },
  { name: "WhatsApp Business", tagline: "Communicate with clients", category: "Communication", url: "https://business.whatsapp.com", bd: false },
  { name: "ChatGPT", tagline: "AI assistant for business", category: "AI Tools", url: "https://chat.openai.com", bd: false },
];

export default function Tools() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <PublicSeo
        path="/tools"
        titleEn="Business Tools — Made in Bangladesh | BanglaHQ"
        titleBn="ব্যবসার টুলস — বাংলাদেশে তৈরি | BanglaHQ"
        descriptionEn="Essential tools for Bangladeshi businesses. Discover Made-in-Bangladesh SaaS products and global tools for marketing, finance, HR, and communication."
        descriptionBn="বাংলাদেশি ব্যবসার জন্য প্রয়োজনীয় টুলস। বাংলাদেশে তৈরি SaaS পণ্য এবং মার্কেটিং, আর্থিক, এইচআর এবং যোগাযোগের জন্য বিশ্বব্যাপী টুলস আবিষ্কার করুন।"
      />
      <Helmet>
        <link rel="alternate" hrefLang="en" href="https://banglahq.com/tools" />
        <link rel="alternate" hrefLang="bn-BD" href="https://banglahq.com/bn/tools" />
        <link rel="alternate" hrefLang="x-default" href="https://banglahq.com/tools" />
      </Helmet>
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground">
            {t("Business Tools", "ব্যবসার টুলস")}
          </h1>
          <p className="font-bengali text-muted-foreground mt-2">
            {t("বাংলাদেশি ব্যবসার জন্য প্রয়োজনীয় টুলস", "Essential tools for Bangladeshi businesses")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
          🇧🇩 {t("Made in Bangladesh", "বাংলাদেশে তৈরি")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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
            </a>
          ))}
        </div>

        <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
          {t("More Tools", "আরও টুলস")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {extraTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-card transition-all group"
            >
              <p className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                {tool.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
              </p>
              <p className="text-xs text-muted-foreground font-ui mt-1">{tool.tagline}</p>
              <span className="text-xs text-primary/60 font-ui mt-2 block">{tool.category}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
