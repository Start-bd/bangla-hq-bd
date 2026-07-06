import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { useBusinessBySlug, useBusinesses } from "@/hooks/use-businesses";
import { CheckCircle, Star, MapPin, Users, Phone, Mail, Globe, Facebook, ArrowLeft, Calendar, Building2, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessCard from "@/components/BusinessCard";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const tabs = [
  { id: "about", en: "About", bn: "সম্পর্কে" },
  { id: "services", en: "Services", bn: "সেবা" },
  { id: "reviews", en: "Reviews", bn: "পর্যালোচনা" },
  { id: "contact", en: "Contact", bn: "যোগাযোগ" },
];

function BusinessJsonLd({ business }: { business: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name_en,
    alternateName: business.name_bn,
    description: business.description_en,
    url: `https://banglahq.com/${business.slug}`,
    telephone: business.phone || undefined,
    email: business.email || undefined,
    foundingDate: business.founded_year ? String(business.founded_year) : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.district,
      addressRegion: business.division,
      addressCountry: "BD",
    },
    ...(business.rating_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating_avg,
        reviewCount: business.rating_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(business.logo_url && { image: business.logo_url }),
    ...(business.website_url && { sameAs: [business.website_url, business.facebook_url].filter(Boolean) }),
  };

  return (
    <Helmet>
      <title>{`${business.name_en} — ${business.name_bn} | BanglaHQ`}</title>
      <meta name="description" content={`${business.description_en.slice(0, 155)}...`} />
      <meta property="og:title" content={`${business.name_en} | BanglaHQ`} />
      <meta property="og:description" content={business.tagline_en || business.description_en.slice(0, 155)} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://banglahq.com/${business.slug}`} />
      <link rel="canonical" href={`https://banglahq.com/${business.slug}`} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

export default function BusinessProfile() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("about");
  const { data: business, isLoading } = useBusinessBySlug(slug);
  const { data: similarBusinesses = [] } = useBusinesses({
    category: business?.category ?? undefined,
    limit: 3,
  });

  const similar = similarBusinesses.filter((b) => b.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("Loading...", "লোড হচ্ছে...")}</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            {t("Business Not Found", "ব্যবসা পাওয়া যায়নি")}
          </h1>
          <Button variant="amber" asChild>
            <Link to="/directory">{t("Browse Directory", "ডিরেক্টরি দেখুন")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = business.name_en.slice(0, 2).toUpperCase();

  const handleFacebookShare = () => {
    const url = encodeURIComponent(`https://banglahq.com/${business.slug}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
  };

  const handleWhatsAppContact = () => {
    if (business.phone) {
      const phone = business.phone.replace(/[^0-9+]/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BusinessJsonLd business={business} />

      {/* Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/80 to-primary/40 relative">
        <div className="container mx-auto px-4 pt-4">
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/directory"><ArrowLeft size={16} /> {t("Back", "ফিরে যান")}</Link>
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-3xl border-4 border-card shadow-warm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                    {t(business.name_en, business.name_bn)}
                  </h1>
                  <p className="font-bengali text-lg text-muted-foreground">
                    {t(business.name_bn, business.name_en)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-ui bg-primary/10 text-primary">
                      {t(business.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()), business.category_bn)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} /> {business.district}, {business.division}
                    </span>
                    {business.is_verified && (
                      <span className="flex items-center gap-1 text-xs text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full animate-pulse-glow">
                        <CheckCircle size={14} /> {t("Verified Business", "যাচাইকৃত ব্যবসা")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star size={20} className="fill-primary text-primary" />
                      <span className="font-display text-2xl text-primary">{business.rating_avg}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-ui">{business.rating_count} {t("reviews", "রিভিউ")}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={14} /> {t("Founded", "প্রতিষ্ঠিত")} {business.founded_year}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {business.employee_range} {t("employees", "কর্মী")}</span>
                <span className="flex items-center gap-1"><Building2 size={14} /> {t(business.tagline_en, business.tagline_bn)}</span>
              </div>

              {/* Contact buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {business.phone && (
                  <Button variant="amber" size="sm" asChild>
                    <a href={`tel:${business.phone}`}><Phone size={14} /> {t("Call", "কল")}</a>
                  </Button>
                )}
                {business.phone && (
                  <Button variant="outline" size="sm" onClick={handleWhatsAppContact} className="text-green-600 border-green-600/30 hover:bg-green-50">
                    💬 WhatsApp
                  </Button>
                )}
                {business.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${business.email}`}><Mail size={14} /> {t("Email", "ইমেইল")}</a>
                  </Button>
                )}
                {business.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer"><Globe size={14} /> {t("Website", "ওয়েবসাইট")}</a>
                  </Button>
                )}
                {business.facebook_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={business.facebook_url} target="_blank" rel="noopener noreferrer"><Facebook size={14} /> Facebook</a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleFacebookShare}>
                  <Share2 size={14} /> {t("Share", "শেয়ার")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-ui font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(tab.en, tab.bn)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 pb-16">
          <div className="md:col-span-2">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                    {t("About", "আমাদের সম্পর্কে")}
                  </h3>
                  <p className="font-body text-foreground/80 leading-relaxed">
                    {t(business.description_en, business.description_bn)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t("Founded", "প্রতিষ্ঠিত"), value: String(business.founded_year) },
                    { label: t("Employees", "কর্মী"), value: business.employee_range },
                    { label: t("District", "জেলা"), value: business.district },
                    { label: t("Division", "বিভাগ"), value: business.division },
                  ].map((fact) => (
                    <div key={fact.label} className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground font-ui">{fact.label}</p>
                      <p className="font-data text-sm text-foreground mt-1">{fact.value}</p>
                    </div>
                  ))}
                </div>
                {business.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground font-ui">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                  {t("Services", "সেবাসমূহ")}
                </h3>
                {business.services.map((svc, i) => (
                  <div key={i} className="p-4 rounded-lg bg-card border border-border">
                    <h4 className="font-heading font-semibold text-foreground">{t(svc.name_en, svc.name_bn)}</h4>
                    <p className="text-sm text-muted-foreground font-body mt-1">{svc.description}</p>
                    <Button variant="amber-outline" size="sm" className="mt-3">
                      {t("Request Quote", "কোটেশন চান")}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                  {t("Reviews", "পর্যালোচনা")}
                </h3>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-card border border-border">
                  <div className="text-center">
                    <p className="font-display text-4xl text-primary">{business.rating_avg}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= Math.round(business.rating_avg) ? "fill-primary text-primary" : "text-border"} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-ui">{business.rating_count} {t("reviews", "রিভিউ")}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-ui">
                  {t("Reviews will appear here when customers leave feedback.", "গ্রাহকরা ফিডব্যাক দিলে এখানে দেখা যাবে।")}
                </p>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                  {t("Contact Information", "যোগাযোগের তথ্য")}
                </h3>
                <div className="space-y-3">
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                      <Phone size={18} className="text-primary" />
                      <span className="font-data text-sm">{business.phone}</span>
                    </a>
                  )}
                  {business.email && (
                    <a href={`mailto:${business.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                      <Mail size={18} className="text-primary" />
                      <span className="font-ui text-sm">{business.email}</span>
                    </a>
                  )}
                  {business.website_url && (
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                      <Globe size={18} className="text-primary" />
                      <span className="font-ui text-sm">{business.website_url}</span>
                      <ExternalLink size={14} className="text-muted-foreground ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {!business.is_claimed && (
              <div className="p-5 rounded-lg border-2 border-primary/30 bg-primary/5 text-center">
                <p className="font-bengali font-semibold text-foreground">এটি কি আপনার ব্যবসা?</p>
                <p className="text-xs text-muted-foreground font-ui mt-1">{t("Claim and update this profile", "এই প্রোফাইলটি দাবি করুন")}</p>
                <Button variant="amber" size="sm" className="mt-3 w-full">
                  {t("Claim Free", "বিনামূল্যে দাবি করুন")}
                </Button>
              </div>
            )}

            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                {t("Quick Stats", "দ্রুত তথ্য")}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Profile Views", "প্রোফাইল ভিউ")}</span>
                  <span className="font-data text-foreground">{business.view_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Rating", "রেটিং")}</span>
                  <span className="font-data text-foreground">{business.rating_avg}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Reviews", "রিভিউ")}</span>
                  <span className="font-data text-foreground">{business.rating_count}</span>
                </div>
              </div>
            </div>

            {/* Facebook Share */}
            <Button variant="outline" className="w-full" onClick={handleFacebookShare}>
              <Facebook size={16} className="text-blue-600" /> {t("Share on Facebook", "ফেসবুকে শেয়ার করুন")}
            </Button>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="pb-16">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
              {t("Similar Businesses", "একই ধরনের ব্যবসা")}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {similar.map((b) => <BusinessCard key={b.id} business={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
