import { useLanguage } from "@/lib/language-context";
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
