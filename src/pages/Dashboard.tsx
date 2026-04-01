import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useMyBusinesses, useBusinessViews, useUpdateBusiness } from "@/hooks/use-my-businesses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, Building2, Edit, CreditCard, LogOut, Eye, Star,
  TrendingUp, ArrowRight, ChevronLeft, Menu, X, ExternalLink,
} from "lucide-react";

type Tab = "overview" | "edit" | "plan";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBizIdx, setSelectedBizIdx] = useState(0);

  const { data: businesses = [], isLoading } = useMyBusinesses(user?.id);
  const selectedBiz = businesses[selectedBizIdx] ?? null;
  const { data: views = [] } = useBusinessViews(selectedBiz?.id);
  const updateBusiness = useUpdateBusiness();

  // Redirect if not authed
  if (!authLoading && !user) {
    navigate("/auth/login");
    return null;
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-ui">{t("Loading...", "লোড হচ্ছে...")}</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
        <Helmet><title>{t("Dashboard — BanglaHQ", "ড্যাশবোর্ড — BanglaHQ")}</title></Helmet>
        <Building2 size={48} className="text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold text-foreground">{t("No businesses yet", "এখনো কোনো ব্যবসা নেই")}</h1>
        <p className="text-muted-foreground font-ui text-center max-w-md">
          {t("Create your first business profile to access the dashboard.", "ড্যাশবোর্ড অ্যাক্সেস করতে আপনার প্রথম ব্যবসার প্রোফাইল তৈরি করুন।")}
        </p>
        <Button variant="amber" asChild>
          <Link to="/onboarding">{t("Add Your Business", "ব্যবসা যোগ করুন")} <ArrowRight size={14} /></Link>
        </Button>
      </div>
    );
  }

  const totalViews = selectedBiz?.view_count ?? 0;
  const recentViews = views.reduce((s, v) => s + v.view_count, 0);
  const planLabel: Record<string, string> = { free: "Free", pro: "Pro", enterprise: "Enterprise" };

  const sidebarItems: { key: Tab; icon: React.ReactNode; label_en: string; label_bn: string }[] = [
    { key: "overview", icon: <BarChart3 size={18} />, label_en: "Overview", label_bn: "ওভারভিউ" },
    { key: "edit", icon: <Edit size={18} />, label_en: "Edit Profile", label_bn: "প্রোফাইল সম্পাদনা" },
    { key: "plan", icon: <CreditCard size={18} />, label_en: "Plan", label_bn: "প্ল্যান" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <Helmet><title>{t("Dashboard — BanglaHQ", "ড্যাশবোর্ড — BanglaHQ")}</title></Helmet>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "fixed inset-0 z-50 bg-card" : "hidden"} md:flex md:static md:w-64 flex-col border-r border-border bg-card`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-lg text-primary">BanglaHQ</Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        {/* Business selector */}
        {businesses.length > 1 && (
          <div className="p-3 border-b border-border">
            <select
              className="w-full text-sm font-ui bg-background border border-border rounded-md px-2 py-1.5"
              value={selectedBizIdx}
              onChange={(e) => setSelectedBizIdx(Number(e.target.value))}
            >
              {businesses.map((b, i) => (
                <option key={b.id} value={i}>{b.name_en}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ui transition-colors ${
                activeTab === item.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {item.icon}
              {t(item.label_en, item.label_bn)}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            to={`/${selectedBiz?.slug}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ui text-muted-foreground hover:bg-accent transition-colors"
          >
            <ExternalLink size={18} />
            {t("View Public Profile", "পাবলিক প্রোফাইল দেখুন")}
          </Link>
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ui text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            {t("Sign Out", "সাইন আউট")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <span className="font-heading font-bold text-sm">{selectedBiz?.name_en}</span>
          <div className="w-5" />
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-4xl">
          {activeTab === "overview" && <OverviewTab biz={selectedBiz!} totalViews={totalViews} recentViews={recentViews} views={views} t={t} />}
          {activeTab === "edit" && <EditTab biz={selectedBiz!} updateBusiness={updateBusiness} t={t} toast={toast} />}
          {activeTab === "plan" && <PlanTab biz={selectedBiz!} planLabel={planLabel} t={t} />}
        </main>
      </div>
    </div>
  );
}

/* ───── Overview Tab ───── */
function OverviewTab({ biz, totalViews, recentViews, views, t }: any) {
  const stats = [
    { icon: <Eye size={20} className="text-primary" />, value: totalViews, label_en: "Total Views", label_bn: "মোট ভিউ" },
    { icon: <TrendingUp size={20} className="text-secondary" />, value: recentViews, label_en: "Last 30 Days", label_bn: "গত ৩০ দিন" },
    { icon: <Star size={20} className="text-primary" />, value: `${Number(biz.rating_avg).toFixed(1)} (${biz.rating_count})`, label_en: "Rating", label_bn: "রেটিং" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t("Dashboard", "ড্যাশবোর্ড")}</h1>
        <p className="text-sm text-muted-foreground font-ui mt-1">{biz.name_en} — {biz.name_bn}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">{s.icon}<span className="text-xs text-muted-foreground font-ui">{t(s.label_en, s.label_bn)}</span></div>
            <p className="font-display text-2xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {views.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">{t("Recent Views", "সাম্প্রতিক ভিউ")}</h3>
          <div className="space-y-2">
            {views.slice(0, 10).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between text-sm font-ui">
                <span className="text-muted-foreground">{new Date(v.viewed_at).toLocaleDateString()}</span>
                <span className="font-data text-foreground">{v.view_count} {t("views", "ভিউ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border-2 border-primary/20 rounded-xl p-5">
        <p className="text-sm font-ui text-muted-foreground">
          {t("Share your profile:", "আপনার প্রোফাইল শেয়ার করুন:")}
        </p>
        <code className="block mt-2 text-sm text-primary font-mono bg-primary/5 px-3 py-2 rounded-lg">
          banglahq.com/{biz.slug}
        </code>
      </div>
    </div>
  );
}

/* ───── Edit Tab ───── */
function EditTab({ biz, updateBusiness, t, toast }: any) {
  const [form, setForm] = useState({
    name_en: biz.name_en ?? "",
    name_bn: biz.name_bn ?? "",
    tagline_en: biz.tagline_en ?? "",
    tagline_bn: biz.tagline_bn ?? "",
    description_en: biz.description_en ?? "",
    description_bn: biz.description_bn ?? "",
    phone: biz.phone ?? "",
    email: biz.email ?? "",
    website_url: biz.website_url ?? "",
    facebook_url: biz.facebook_url ?? "",
    address: biz.address ?? "",
    employee_range: biz.employee_range ?? "",
  });

  const handleSave = async () => {
    try {
      await updateBusiness.mutateAsync({ id: biz.id, updates: form });
      toast({ title: t("Saved!", "সংরক্ষিত!") });
    } catch (err: any) {
      toast({ title: t("Error saving", "সংরক্ষণে ত্রুটি"), description: err.message, variant: "destructive" });
    }
  };

  const field = (key: string, label_en: string, label_bn: string, type: "input" | "textarea" = "input") => (
    <div key={key} className="space-y-1.5">
      <Label className="font-ui text-sm">{t(label_en, label_bn)}</Label>
      {type === "textarea" ? (
        <Textarea
          value={(form as any)[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={3}
        />
      ) : (
        <Input
          value={(form as any)[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{t("Edit Profile", "প্রোফাইল সম্পাদনা")}</h1>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-heading font-semibold text-foreground">{t("Basic Info", "মৌলিক তথ্য")}</h3>
        {field("name_en", "Business Name (English)", "ব্যবসার নাম (ইংরেজি)")}
        {field("name_bn", "Business Name (Bengali)", "ব্যবসার নাম (বাংলা)")}
        {field("tagline_en", "Tagline (English)", "ট্যাগলাইন (ইংরেজি)")}
        {field("tagline_bn", "Tagline (Bengali)", "ট্যাগলাইন (বাংলা)")}
        {field("description_en", "Description (English)", "বিবরণ (ইংরেজি)", "textarea")}
        {field("description_bn", "Description (Bengali)", "বিবরণ (বাংলা)", "textarea")}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-heading font-semibold text-foreground">{t("Contact & Location", "যোগাযোগ ও অবস্থান")}</h3>
        {field("phone", "Phone", "ফোন")}
        {field("email", "Email", "ইমেইল")}
        {field("website_url", "Website", "ওয়েবসাইট")}
        {field("facebook_url", "Facebook URL", "ফেসবুক URL")}
        {field("address", "Address", "ঠিকানা")}
        {field("employee_range", "Employee Range", "কর্মী সংখ্যা")}
      </div>

      <Button variant="amber" onClick={handleSave} disabled={updateBusiness.isPending} className="w-full sm:w-auto">
        {updateBusiness.isPending ? t("Saving...", "সংরক্ষণ হচ্ছে...") : t("Save Changes", "পরিবর্তন সংরক্ষণ করুন")}
      </Button>
    </div>
  );
}

/* ───── Plan Tab ───── */
function PlanTab({ biz, planLabel, t }: any) {
  const isPro = biz.plan === "pro" || biz.plan === "enterprise";

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{t("Plan Management", "প্ল্যান ব্যবস্থাপনা")}</h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground font-ui">{t("Current Plan", "বর্তমান প্ল্যান")}</p>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{planLabel[biz.plan] ?? "Free"}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-ui font-semibold ${isPro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {isPro ? t("Active", "সক্রিয়") : t("Free Tier", "বিনামূল্যে")}
          </div>
        </div>
        {biz.plan_expires_at && (
          <p className="text-xs text-muted-foreground font-ui">
            {t("Expires:", "মেয়াদ শেষ:")} {new Date(biz.plan_expires_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {!isPro && (
        <div className="bg-card border-2 border-primary/30 rounded-xl p-6">
          <h3 className="font-heading font-bold text-lg text-foreground">{t("Upgrade to Pro", "প্রো-তে আপগ্রেড করুন")}</h3>
          <p className="text-sm text-muted-foreground font-ui mt-2">
            {t(
              "Get verified badge, priority placement, full analytics, WhatsApp button, and more.",
              "যাচাইকৃত ব্যাজ, অগ্রাধিকার প্লেসমেন্ট, সম্পূর্ণ অ্যানালিটিক্স, WhatsApp বাটন এবং আরও অনেক কিছু পান।"
            )}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl text-primary">৳1,500</span>
            <span className="text-sm text-muted-foreground font-ui">/{t("month", "মাস")}</span>
          </div>
          <Button variant="amber" className="mt-4" asChild>
            <Link to="/pricing">{t("View Plans", "প্ল্যান দেখুন")} <ArrowRight size={14} /></Link>
          </Button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <h3 className="font-heading font-semibold text-foreground">{t("Add-ons", "অ্যাড-অন")}</h3>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-ui text-sm font-medium text-foreground">{t("Verified Badge", "যাচাইকৃত ব্যাজ")}</p>
            <p className="text-xs text-muted-foreground font-ui">{t("One-time verification", "একবারের যাচাইকরণ")}</p>
          </div>
          <div className="text-right">
            <p className="font-data text-sm text-primary">৳499</p>
            {biz.is_verified ? (
              <span className="text-xs text-secondary font-ui">✓ {t("Active", "সক্রিয়")}</span>
            ) : (
              <Button variant="outline" size="sm" className="mt-1 text-xs h-7">
                {t("Get Verified", "যাচাই করুন")}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-ui text-sm font-medium text-foreground">{t("Featured Listing", "ফিচার্ড তালিকা")}</p>
            <p className="text-xs text-muted-foreground font-ui">{t("7-day homepage spotlight", "৭ দিনের হোমপেজ স্পটলাইট")}</p>
          </div>
          <div className="text-right">
            <p className="font-data text-sm text-primary">৳2,000/{t("week", "সপ্তাহ")}</p>
            {biz.is_featured ? (
              <span className="text-xs text-secondary font-ui">✓ {t("Active", "সক্রিয়")}</span>
            ) : (
              <Button variant="outline" size="sm" className="mt-1 text-xs h-7">
                {t("Boost", "বুস্ট করুন")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
