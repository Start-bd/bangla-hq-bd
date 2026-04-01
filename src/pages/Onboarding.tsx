import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Building2, MapPin, Phone, Globe } from "lucide-react";

const categories = [
  { en: "IT & Software", bn: "আইটি ও সফটওয়্যার" },
  { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
  { en: "Education", bn: "শিক্ষা" },
  { en: "Garments & Textiles", bn: "গার্মেন্টস ও টেক্সটাইল" },
  { en: "Food & Restaurant", bn: "খাদ্য ও রেস্তোরাঁ" },
  { en: "Finance & Banking", bn: "অর্থ ও ব্যাংকিং" },
  { en: "Real Estate", bn: "রিয়েল এস্টেট" },
  { en: "E-commerce", bn: "ই-কমার্স" },
  { en: "Agriculture", bn: "কৃষি" },
  { en: "Manufacturing", bn: "উৎপাদন" },
  { en: "Transport & Logistics", bn: "পরিবহন ও লজিস্টিকস" },
  { en: "Retail", bn: "খুচরা" },
  { en: "Construction", bn: "নির্মাণ" },
  { en: "Legal", bn: "আইন" },
  { en: "Other", bn: "অন্যান্য" },
];

const divisions = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh",
];

const employeeRanges = ["1-5", "6-20", "21-50", "51-200", "201-500", "500+"];

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Basic info
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [category, setCategory] = useState("");
  const [taglineEn, setTaglineEn] = useState("");
  const [taglineBn, setTaglineBn] = useState("");

  // Step 2: Details
  const [descEn, setDescEn] = useState("");
  const [descBn, setDescBn] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [employeeRange, setEmployeeRange] = useState("");

  // Step 3: Location
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // Step 4: Contact
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: t("Please log in first", "প্রথমে লগইন করুন"),
          description: t("You need an account to add a business.", "ব্যবসা যোগ করতে আপনার একটি অ্যাকাউন্ট প্রয়োজন।"),
          variant: "destructive",
        });
        navigate("/auth/login");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate, toast, t]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const canProceed = () => {
    if (step === 1) return nameEn.trim().length > 0 && category.length > 0;
    if (step === 2) return true;
    if (step === 3) return division.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!userId) return;
    setSubmitting(true);

    const slug = slugify(nameEn) || `biz-${Date.now()}`;
    const selectedCat = categories.find((c) => c.en === category);

    const { error } = await supabase.from("businesses").insert({
      name_en: nameEn.trim(),
      name_bn: nameBn.trim() || nameEn.trim(),
      slug,
      category,
      category_bn: selectedCat?.bn || "",
      tagline_en: taglineEn.trim(),
      tagline_bn: taglineBn.trim(),
      description_en: descEn.trim(),
      description_bn: descBn.trim(),
      founded_year: foundedYear ? parseInt(foundedYear) : null,
      employee_range: employeeRange,
      division,
      district: district.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website_url: websiteUrl.trim(),
      facebook_url: facebookUrl.trim(),
      owner_id: userId,
      status: "active" as const,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: t("Failed to create business", "ব্যবসা তৈরি ব্যর্থ"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("Business created!", "ব্যবসা তৈরি হয়েছে!"), description: t(`Visit banglahq.com/${slug}`, `banglahq.com/${slug} -এ যান`) });
      navigate(`/${slug}`);
    }
  };

  const stepIcons = [Building2, Building2, MapPin, Phone];
  const stepLabels = [
    { en: "Basic Info", bn: "প্রাথমিক তথ্য" },
    { en: "Details", bn: "বিস্তারিত" },
    { en: "Location", bn: "অবস্থান" },
    { en: "Contact", bn: "যোগাযোগ" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t("Add Your Business — BanglaHQ", "আপনার ব্যবসা যোগ করুন — BanglaHQ")}</title>
      </Helmet>

      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="font-ui text-sm text-muted-foreground">
              {t(`Step ${step} of ${TOTAL_STEPS}`, `ধাপ ${step}/${TOTAL_STEPS}`)}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, i) => (
              <span
                key={i}
                className={`text-xs font-ui ${i < step ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                {t(label.en, label.bn)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("Tell us about your business", "আপনার ব্যবসা সম্পর্কে বলুন")}
              </h2>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Business Name (English) *", "ব্যবসার নাম (ইংরেজি) *")}</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} maxLength={150} placeholder="e.g. Dhaka Tech Solutions" />
            </div>
            <div className="space-y-2">
              <Label className="font-ui font-bengali">{t("Business Name (বাংলা)", "ব্যবসার নাম (বাংলা)")}</Label>
              <Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} maxLength={150} placeholder="যেমন: ঢাকা টেক সলিউশনস" className="font-bengali" lang="bn" />
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Category *", "ক্যাটাগরি *")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder={t("Select category", "ক্যাটাগরি নির্বাচন করুন")} /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.en} value={c.en}>{lang === "bn" ? c.bn : c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Tagline (English)", "ট্যাগলাইন (ইংরেজি)")}</Label>
              <Input value={taglineEn} onChange={(e) => setTaglineEn(e.target.value)} maxLength={200} placeholder={t("Short one-liner", "সংক্ষিপ্ত একটি লাইন")} />
            </div>
            <div className="space-y-2">
              <Label className="font-ui font-bengali">{t("Tagline (বাংলা)", "ট্যাগলাইন (বাংলা)")}</Label>
              <Input value={taglineBn} onChange={(e) => setTaglineBn(e.target.value)} maxLength={200} className="font-bengali" lang="bn" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("Business details", "ব্যবসার বিস্তারিত")}
              </h2>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Description (English)", "বিবরণ (ইংরেজি)")}</Label>
              <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} maxLength={2000} rows={4} placeholder={t("What does your business do?", "আপনার ব্যবসা কী করে?")} />
            </div>
            <div className="space-y-2">
              <Label className="font-ui font-bengali">{t("Description (বাংলা)", "বিবরণ (বাংলা)")}</Label>
              <Textarea value={descBn} onChange={(e) => setDescBn(e.target.value)} maxLength={2000} rows={4} className="font-bengali" lang="bn" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-ui">{t("Founded Year", "প্রতিষ্ঠার বছর")}</Label>
                <Input type="number" min={1900} max={new Date().getFullYear()} value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="2020" />
              </div>
              <div className="space-y-2">
                <Label className="font-ui">{t("Employees", "কর্মচারী")}</Label>
                <Select value={employeeRange} onValueChange={setEmployeeRange}>
                  <SelectTrigger><SelectValue placeholder={t("Select", "নির্বাচন")} /></SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("Where is your business?", "আপনার ব্যবসা কোথায়?")}
              </h2>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Division *", "বিভাগ *")}</Label>
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger><SelectValue placeholder={t("Select division", "বিভাগ নির্বাচন করুন")} /></SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("District", "জেলা")}</Label>
              <Input value={district} onChange={(e) => setDistrict(e.target.value)} maxLength={100} placeholder={t("e.g. Gazipur", "যেমন: গাজীপুর")} />
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Full Address", "পূর্ণ ঠিকানা")}</Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} maxLength={500} rows={2} className="font-bengali" lang="bn" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("Contact information", "যোগাযোগের তথ্য")}
              </h2>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Phone Number", "ফোন নম্বর")}</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+880 1XXX-XXXXXX" />
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Business Email", "ব্যবসার ইমেইল")}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="info@yourbusiness.com" />
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Website URL", "ওয়েবসাইট URL")}</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} maxLength={500} className="pl-9" placeholder="https://yourbusiness.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-ui">{t("Facebook Page URL", "ফেসবুক পেজ URL")}</Label>
              <Input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} maxLength={500} placeholder="https://facebook.com/yourbusiness" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <div className="container mx-auto max-w-lg flex gap-3">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} className="mr-1" />
              {t("Back", "পিছনে")}
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button className="flex-1" disabled={!canProceed()} onClick={() => setStep(step + 1)}>
              {t("Continue", "চালিয়ে যান")}
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button className="flex-1" disabled={submitting || !canProceed()} onClick={handleSubmit}>
              <Check size={16} className="mr-1" />
              {submitting ? t("Creating...", "তৈরি হচ্ছে...") : t("Create Business", "ব্যবসা তৈরি করুন")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
