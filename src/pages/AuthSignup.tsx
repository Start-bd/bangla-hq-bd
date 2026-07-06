import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function AuthSignup() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !fullName.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: t("Signup failed", "সাইন আপ ব্যর্থ"), description: error.message, variant: "destructive" });
    } else {
      toast({
        title: t("Check your email", "আপনার ইমেইল চেক করুন"),
        description: t(
          "We sent a verification link to your email.",
          "আমরা আপনার ইমেইলে একটি যাচাইকরণ লিঙ্ক পাঠিয়েছি।"
        ),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>{t("Sign Up — BanglaHQ", "সাইন আপ — BanglaHQ")}</title>
        <meta name="description" content="Create a free BanglaHQ account to list your Bangladeshi business, reach new customers, and join the country's largest business directory." />
        <meta property="og:title" content="Sign Up — BanglaHQ" />
        <meta property="og:description" content="Create a free account and list your Bangladeshi business on BanglaHQ." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://banglahq.com/auth/signup" />
      </Helmet>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t("Create your account", "আপনার অ্যাকাউন্ট তৈরি করুন")}
          </h1>
          <p className="mt-2 text-muted-foreground font-ui text-sm">
            {t("Join 8M+ Bangladeshi businesses", "৮০ লক্ষ+ বাংলাদেশি ব্যবসায় যোগ দিন")}
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-ui">{t("Full Name", "পূর্ণ নাম")}</Label>
            <Input
              id="fullName"
              required
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("Your full name", "আপনার পূর্ণ নাম")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-ui">{t("Email", "ইমেইল")}</Label>
            <Input
              id="email"
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-ui">{t("Password", "পাসওয়ার্ড")}</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Min 6 characters", "ন্যূনতম ৬ অক্ষর")}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("Creating account...", "অ্যাকাউন্ট তৈরি হচ্ছে...") : t("Sign Up", "সাইন আপ করুন")}
          </Button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-ui">{t("or", "অথবা")}</span></div>
          </div>
          <GoogleSignInButton />
        </form>

        <p className="text-center text-sm text-muted-foreground font-ui">
          {t("Already have an account?", "ইতোমধ্যে অ্যাকাউন্ট আছে?")}{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            {t("Log in", "লগইন করুন")}
          </Link>
        </p>
      </div>
    </div>
  );
}
