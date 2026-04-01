import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name_en: "Free", name_bn: "বিনামূল্যে",
    price: "৳0", period_en: "forever", period_bn: "সর্বদা",
    features_en: [
      "Basic business profile page",
      "Up to 5 services listed",
      "Contact details",
      "Customer reviews",
      "Profile views (last 7 days)",
      "BanglaHQ.com/[slug] URL",
    ],
    features_bn: [
      "বেসিক ব্যবসার প্রোফাইল পেজ",
      "সর্বোচ্চ ৫টি সেবা তালিকাভুক্ত",
      "যোগাযোগের তথ্য",
      "গ্রাহক রিভিউ",
      "প্রোফাইল ভিউ (গত ৭ দিন)",
      "BanglaHQ.com/[slug] URL",
    ],
    cta_en: "Get Started Free", cta_bn: "বিনামূল্যে শুরু করুন",
    highlighted: false,
  },
  {
    name_en: "Pro", name_bn: "প্রো",
    price: "৳1,500", period_en: "/month", period_bn: "/মাস",
    features_en: [
      "Everything in Free",
      "✓ Verified Business badge",
      "Priority search placement",
      "Full analytics (30 days)",
      "Up to 20 services listed",
      "Portfolio gallery (20 images)",
      "Unlimited B2B RFQ responses",
      "Featured badge (1 week/month)",
      "WhatsApp Business button",
    ],
    features_bn: [
      "ফ্রি-এর সবকিছু",
      "✓ যাচাইকৃত ব্যবসা ব্যাজ",
      "অগ্রাধিকার সার্চ প্লেসমেন্ট",
      "সম্পূর্ণ অ্যানালিটিক্স (৩০ দিন)",
      "সর্বোচ্চ ২০টি সেবা",
      "পোর্টফোলিও গ্যালারি (২০ ছবি)",
      "সীমাহীন B2B RFQ রেসপন্স",
      "ফিচার্ড ব্যাজ (১ সপ্তাহ/মাস)",
      "WhatsApp Business বাটন",
    ],
    cta_en: "Upgrade to Pro", cta_bn: "প্রো-তে আপগ্রেড করুন",
    highlighted: true,
  },
  {
    name_en: "Verified Badge", name_bn: "যাচাইকৃত ব্যাজ",
    price: "৳499", period_en: "one-time", period_bn: "একবারের মূল্য",
    features_en: [
      "Admin reviews documents",
      "Green ✓ badge forever",
      "\"Verified\" in search results",
      "Higher customer trust",
      "Add to Free or Pro plan",
    ],
    features_bn: [
      "অ্যাডমিন ডকুমেন্ট যাচাই",
      "সবুজ ✓ ব্যাজ সর্বদা",
      "সার্চ রেজাল্টে \"যাচাইকৃত\"",
      "গ্রাহকদের বেশি আস্থা",
      "ফ্রি বা প্রো প্ল্যানে যোগ করুন",
    ],
    cta_en: "Get Verified", cta_bn: "যাচাই করুন",
    highlighted: false,
  },
];

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            {t("Plans & Pricing", "প্ল্যান ও মূল্য")}
          </h1>
          <p className="font-bengali text-muted-foreground mt-2 max-w-lg mx-auto">
            {t(
              "প্রতিটি বাংলাদেশি ব্যবসার জন্য সঠিক প্ল্যান",
              "The right plan for every Bangladeshi business"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name_en}
              className={`rounded-xl p-6 border-2 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-warm relative"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-ui font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} /> {t("Most Popular", "সবচেয়ে জনপ্রিয়")}
                </div>
              )}
              <h3 className="font-heading font-bold text-xl text-foreground">{t(plan.name_en, plan.name_bn)}</h3>
              <div className="mt-3">
                <span className="font-display text-4xl text-primary">{plan.price}</span>
                <span className="text-sm text-muted-foreground font-ui ml-1">{t(plan.period_en, plan.period_bn)}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {(t(plan.features_en.join("|||"), plan.features_bn.join("|||"))).split("|||").map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-ui text-foreground">
                    <Check size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "amber" : "amber-outline"}
                className="w-full mt-6"
                asChild
              >
                <Link to="/onboarding">{t(plan.cta_en, plan.cta_bn)} <ArrowRight size={14} /></Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground font-ui">
            {t("Annual discount: 2 months free on Pro plan", "বার্ষিক ছাড়: প্রো প্ল্যানে ২ মাস বিনামূল্যে")}
          </p>
        </div>
      </div>
    </div>
  );
}
