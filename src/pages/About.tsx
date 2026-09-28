import { useLanguage } from "@/lib/language-context";
import PublicSeo from "@/components/PublicSeo";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-16">
      <PublicSeo
        path="/about"
        titleEn="About BanglaHQ — Bangladesh's Official Business Directory"
        titleBn="BanglaHQ সম্পর্কে — বাংলাদেশের আনুষ্ঠানিক ব্যবসার ডিরেক্টরি"
        descriptionEn="BanglaHQ is Bangladesh's definitive business directory and growth platform. Every business deserves a professional digital presence."
        descriptionBn="BanglaHQ হলো বাংলাদেশের চূড়ান্ত ব্যবসার ডিরেক্টরি ও গ্রোথ প্ল্যাটফর্ম। প্রতিটি ব্যবসার একটি পেশাদার ডিজিটাল উপস্থিতি পাওয়ার যোগ্য।"
        ogImage="https://banglahq.com/og-about.jpg"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground text-center">
          {t("About BanglaHQ", "BanglaHQ সম্পর্কে")}
        </h1>
        <p className="font-bengali text-center text-lg text-muted-foreground mt-2">
          বাংলাদেশের ব্যবসার সদর দফতর
        </p>

        <div className="mt-10 space-y-8 font-body text-foreground/80 leading-relaxed">
          <p>
            {t(
              "BanglaHQ is Bangladesh's definitive business directory and growth platform. We believe every Bangladeshi business — from a Dhaka tech startup to a Mymensingh grocery shop — deserves a professional digital presence.",
              "BanglaHQ হলো বাংলাদেশের চূড়ান্ত ব্যবসার ডিরেক্টরি ও গ্রোথ প্ল্যাটফর্ম। আমরা বিশ্বাস করি প্রতিটি বাংলাদেশি ব্যবসা — ঢাকার টেক স্টার্টআপ থেকে ময়মনসিংহের মুদি দোকান — একটি পেশাদার ডিজিটাল উপস্থিতি পাওয়ার যোগ্য।"
            )}
          </p>
          <p>
            {t(
              "Our mission is to become the digital front door for Bangladesh's 8+ million businesses. We combine the best of Google Business Profile, Clutch.co, LinkedIn Company Pages, and Yellow Pages — all unified under one national platform, in both Bengali and English.",
              "আমাদের লক্ষ্য হলো বাংলাদেশের ৮+ মিলিয়ন ব্যবসার ডিজিটাল ফ্রন্ট ডোর হয়ে ওঠা। আমরা Google Business Profile, Clutch.co, LinkedIn Company Pages এবং Yellow Pages-এর সেরা অংশগুলো একত্রিত করেছি — একটি জাতীয় প্ল্যাটফর্মে, বাংলা ও ইংরেজি উভয় ভাষায়।"
            )}
          </p>
          <p>
            {t(
              "BanglaHQ is part of the StartBD ecosystem — building technology products for Bangladesh from Mymensingh.",
              "BanglaHQ হলো StartBD ইকোসিস্টেমের অংশ — ময়মনসিংহ থেকে বাংলাদেশের জন্য প্রযুক্তি পণ্য তৈরি করছে।"
            )}
          </p>
        </div>

        <div className="text-center mt-12">
          <Button variant="amber" asChild>
            <Link to="/onboarding">{t("Add Your Business", "ব্যবসা যোগ করুন")} <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
