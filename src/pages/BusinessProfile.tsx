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

const SITE_URL = "https://banglahq.com";

function BusinessJsonLd({ business, lang }: { business: any; lang: "en" | "bn" }) {
  const enUrl = `${SITE_URL}/${business.slug}`;
  const bnUrl = `${SITE_URL}/bn/${business.slug}`;

  const name = lang === "bn" ? business.name_bn : business.name_en;
  const description = lang === "bn" ? business.description_bn : business.description_en;
  const tagline = lang === "bn" ? business.tagline_bn : business.tagline_en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name || name_en_fallback(business),
    alternateName: business.name_bn || business.name_en,
    description: description || tagline || "",
    url: lang === "bn" ? bnUrl : enUrl,
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
    ...(business.logo_url?.trim() && { image: business.logo_url }),
    ...((business.website_url || business.facebook_url) && {
      sameAs: [business.website_url, business.facebook_url].filter(Boolean),
    }),
  };

  const descForMeta = description
    ? description.length > 155
      ? `${description.slice(0, 155).replace(/\s+\S*$/, "")}…`
      : description
    : (tagline || "");

  const ogDesc = tagline || descForMeta;

  return (
    <Helmet htmlAttributes={{ lang: lang === "bn" ? "bn-BD" : "en" }}>
      <title>{`${name} | BanglaHQ`}</title>
      <meta name="description" content={descForMeta} />
      <link rel="canonical" href={lang === "bn" ? bnUrl : enUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="bn-BD" href={bnUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:title" content={`${name} | BanglaHQ`} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={lang === "bn" ? bnUrl : enUrl} />
      <meta property="og:locale" content={lang === "bn" ? "bn_BD" : "en_US"} />
      <meta property="og:locale:alternate" content={lang === "bn" ? "en_US" : "bn_BD"} />
      <meta property="og:image" content={business.logo_url || business.cover_url || `${SITE_URL}/og-banglahq.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={business.logo_url || business.cover_url || `${SITE_URL}/og-banglahq.jpg`} />
      <meta name="twitter:title" content={`${name} | BanglaHQ`} />
      <meta name="twitter:description" content={ogDesc} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

function name_en_fallback(b: any) {
  return b.name_en || "Business";
}

export default function BusinessProfile() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
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

  const initials = (business.name_en || business.name_bn || "").slice(0, 2).toUpperCase();

  const handleFacebookShare = () => {
    const url = encodeURIComponent(`${SITE_URL}/${business.slug}`);
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
      <BusinessJsonLd business={business} lang={lang} />

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
                    <div className="font-heading font-bold text-2xl text-foreground">
                      {business.rating_avg.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star size={14} className="fill-primary text-primary" />
                      {business.rating_count} {t("reviews", "রিভিউ")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading font-bold text-2xl text-foreground">
                      {business.view_count.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("views", "দর্শন")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3">
          {business.website_url && (
            <Button variant="outline" asChild>
              <a href={business.website_url} target="_blank" rel="noopener noreferrer">
                <Globe size={16} className="mr-1" /> {t("Visit Website", "ওয়েবসাইট দেখুন")}
              </a>
            </Button>
          )}
          {business.facebook_url && (
            <Button variant="outline" asChild>
              <a href={business.facebook_url} target="_blank" rel="noopener noreferrer">
                <Facebook size={16} className="mr-1" /> Facebook
              </a>
            </Button>
          )}
          {business.phone && (
            <Button variant="outline" onClick={handleWhatsAppContact}>
              <Phone size={16} className="mr-1" /> {t("WhatsApp", "ওয়াটসঅ্যাপ")}
            </Button>
          )}
          {business.email && (
            <Button variant="outline" asChild>
              <a href={`mailto:${business.email}`}>
                <Mail size={16} className="mr-1" /> {t("Email", "ইমেইল")}
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={handleFacebookShare}>
            <Share2 size={16} className="mr-1" /> {t("Share", "শেয়ার করুন")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-6 border-b border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-ui border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(tab.en, tab.bn)}
            </button>
          ))}
        </div>

        {/* About tab */}
        {activeTab === "about" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              {t("About", "সম্পর্কে")}
            </h2>
            {business.description_en || business.description_bn ? (
              <div
                className="font-body text-foreground/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: (lang === "bn" ? business.description_bn : business.description_en) || "" }}
              />
            ) : (
              <p className="text-muted-foreground italic">{t("No description yet.", "এখনো কোনো বিবরণ নেই।")}</p>
            )}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-background rounded-lg p-3">
                <span className="text-muted-foreground font-ui">{t("Founded", "প্রতিষ্ঠিত")}</span>
                <div className="mt-1 font-heading font-semibold text-foreground">
                  {business.founded_year ? business.founded_year : t("Unknown", "অজানা")}
                </div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <span className="text-muted-foreground font-ui">{t("Employees", "কর্মী")}</span>
                <div className="mt-1 font-heading font-semibold text-foreground">
                  {business.employee_range || t("Not specified", "নির্দিষ্ট নয়")}
                </div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <span className="text-muted-foreground font-ui">{t("Location", "অবস্থান")}</span>
                <div className="mt-1 font-heading font-semibold text-foreground">
                  {business.district && <span className="flex items-center gap-1"><MapPin size={14} /> {business.district}</span>}
                  {business.division && business.district && <span className="text-muted-foreground">, </span>}
                  {business.division && <span className="text-muted-foreground">{business.division}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services tab */}
        {activeTab === "services" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              {t("Services", "সেবা")}
            </h2>
            {business.services && business.services.length > 0 ? (
              <ul className="space-y-3">
                {business.services.map((service: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-body text-foreground/80">
                      {typeof service === "string" ? service : t(service.name_en || "", service.name_bn || "")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">{t("No services listed.", "কোনো সেবা তালিকাভুক্ত নেই।")}</p>
            )}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              {t("Reviews", "পর্যালোচনা")}
            </h2>
            {business.rating_count > 0 ? (
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="font-heading font-bold text-4xl text-foreground">
                    {business.rating_avg.toFixed(1)}
                  </div>
                  <div className="flex gap-0.5 text-secondary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${star <= Math.round(business.rating_avg) ? "fill-primary text-primary" : "text-secondary/30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {business.rating_count} {t("reviews", "রিভিউ")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">{t("No reviews yet.", "এখনো কোনো রিভিউ নেই।")}</p>
            )}
          </div>
        )}

        {/* Contact tab */}
        {activeTab === "contact" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              {t("Contact", "যোগাযোগ")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.address && (
                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-ui text-sm text-muted-foreground">{t("Address", "ঠিকানা")}</p>
                    <p className="font-body text-foreground/80">{business.address}</p>
                    <p className="font-ui text-sm text-muted-foreground mt-1">
                      {business.district}, {business.division}, Bangladesh
                    </p>
                  </div>
                </div>
              )}
              {business.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-ui text-sm text-muted-foreground">{t("Phone", "ফোন")}</p>
                    <a href={`tel:${business.phone}`} className="font-body text-foreground/80 hover:text-primary">
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}
              {business.email && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-ui text-sm text-muted-foreground">{t("Email", "ইমেইল")}</p>
                    <a href={`mailto:${business.email}`} className="font-body text-foreground/80 hover:text-primary">
                      {business.email}
                    </a>
                  </div>
                </div>
              )}
              {business.website_url && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-ui text-sm text-muted-foreground">{t("Website", "ওয়েবসাইট")}</p>
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="font-body text-foreground/80 hover:text-primary">
                      {business.website_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Similar businesses */}
      {similar.length > 0 && (
        <div className="bg-card border-b border-border py-8">
          <div className="container mx-auto px-4">
            <h2 className="font-heading font-bold text-xl text-foreground mb-6">
              {t("Similar Businesses", "অনুরূপ ব্যবসা")}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {similar.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
