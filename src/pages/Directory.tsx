import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-context";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessCard from "@/components/BusinessCard";
import { categories, divisions } from "@/lib/mock-data";
import { useBusinesses } from "@/hooks/use-businesses";

export default function Directory() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: businesses = [], isLoading } = useBusinesses({
    category: selectedCategory,
    division: selectedDivision,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            {t("Business Directory", "ব্যবসার ডিরেক্টরি")}
          </h1>
          <p className="font-bengali text-muted-foreground mt-1">
            {t("বাংলাদেশের সব ব্যবসা এক জায়গায়", "All Bangladeshi businesses in one place")}
          </p>

          <div className="mt-4 flex gap-2">
            <div className="flex-1 flex items-center bg-background rounded-lg border border-border px-3">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search businesses...", "ব্যবসা খুঁজুন...")}
                className="w-full px-3 py-2.5 bg-transparent font-ui text-sm focus:outline-none"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? "fixed inset-0 z-50 bg-card p-6 overflow-auto" : "hidden"} md:block md:static md:w-64 flex-shrink-0`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4 md:hidden">
                <h3 className="font-heading font-bold">{t("Filters", "ফিল্টার")}</h3>
                <button onClick={() => setShowFilters(false)}><X size={24} /></button>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                  {t("Category", "ক্যাটাগরি")}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory(null); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-ui transition-colors ${!selectedCategory ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                  >
                    {t("All Categories", "সব ক্যাটাগরি")}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-ui transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                    >
                      <span>{cat.icon} {t(cat.name_en, cat.name_bn)}</span>
                      <span className="text-xs font-data">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
                  {t("Division", "বিভাগ")}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedDivision(null); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-ui transition-colors ${!selectedDivision ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                  >
                    {t("All Divisions", "সব বিভাগ")}
                  </button>
                  {divisions.map((div) => (
                    <button
                      key={div.name_en}
                      onClick={() => { setSelectedDivision(div.name_en); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-ui transition-colors flex items-center justify-between ${selectedDivision === div.name_en ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                    >
                      <span>{t(div.name_en, div.name_bn)}</span>
                      <span className="text-xs font-data">{div.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground font-ui">
                {isLoading ? t("Loading...", "লোড হচ্ছে...") : `${businesses.length} ${t("businesses found", "ব্যবসা পাওয়া গেছে")}`}
              </p>
              <select className="text-sm font-ui border border-border rounded-md px-3 py-1.5 bg-card">
                <option>{t("Relevance", "প্রাসঙ্গিকতা")}</option>
                <option>{t("Most Reviewed", "সর্বাধিক রিভিউ")}</option>
                <option>{t("Recently Added", "সম্প্রতি যুক্ত")}</option>
              </select>
            </div>
            <div className="grid gap-4">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
            {!isLoading && businesses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-ui">{t("No businesses found.", "কোনো ব্যবসা পাওয়া যায়নি।")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
