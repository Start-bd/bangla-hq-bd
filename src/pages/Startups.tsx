import { useLanguage } from "@/lib/language-context";
import PublicSeo from "@/components/PublicSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BusinessCard from "@/components/BusinessCard";
import { useBusinesses } from "@/hooks/use-businesses";
import { Zap, ArrowRight } from "lucide-react";

export default function Startups() {
  const { t, localizePath } = useLanguage();
  const { data: startups = [], isLoading } = useBusinesses({ startup: true });

  return (
    <div className="min-h-screen bg-background">
      <PublicSeo
        path="/startups"
        titleEn="Bangladesh Startups & Innovation | BanglaHQ"
        titleBn="বাংলাদেশের স্টার্টআপ ও উদ্ভাবন | BanglaHQ"
        descriptionEn="Discover active Bangladeshi startups in technology, AI, fintech and more. Explore founders and emerging companies in Bangladesh's startup ecosystem."
        descriptionBn="প্রযুক্তি, এআই, ফিনটেকসহ বিভিন্ন খাতের সক্রিয় বাংলাদেশি স্টার্টআপ আবিষ্কার করুন। বাংলাদেশের উদীয়মান কোম্পানি ও প্রতিষ্ঠাতাদের খুঁজুন।"
      />
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={28} className="text-primary" />
            <h1 className="font-heading font-bold text-3xl text-foreground">
              {t("Bangladesh Startups", "বাংলাদেশের স্টার্টআপ")}
            </h1>
          </div>
          <p className="font-bengali text-muted-foreground max-w-lg mx-auto">
            {t(
              "বাংলাদেশের উদীয়মান স্টার্টআপ — প্রযুক্তি, AI, ফিনটেক এবং আরও অনেক কিছু",
              "Emerging Bangladeshi startups — technology, AI, fintech, and more"
            )}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-muted-foreground">{t("Loading...", "লোড হচ্ছে...")}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
        {!isLoading && startups.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t("No startups yet.", "এখনো কোনো স্টার্টআপ নেই।")}</p>
          </div>
        )}
        <div className="text-center mt-12">
          <Button variant="amber" asChild>
            <Link to={localizePath("/onboarding")}>{t("Submit Your Startup", "আপনার স্টার্টআপ জমা দিন")} <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
