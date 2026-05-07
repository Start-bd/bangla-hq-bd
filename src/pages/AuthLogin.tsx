import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function AuthLogin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: t("Login failed", "লগইন ব্যর্থ"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("Welcome back!", "আবারও স্বাগতম!") });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>{t("Login — BanglaHQ", "লগইন — BanglaHQ")}</title>
      </Helmet>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t("Welcome back", "আবারও স্বাগতম")}
          </h1>
          <p className="mt-2 text-muted-foreground font-ui text-sm">
            {t("Log in to manage your business", "আপনার ব্যবসা পরিচালনা করতে লগইন করুন")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-card rounded-xl p-6 border border-border shadow-sm">
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("Logging in...", "লগইন হচ্ছে...") : t("Log In", "লগইন করুন")}
          </Button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-ui">{t("or", "অথবা")}</span></div>
          </div>
          <GoogleSignInButton />
        </form>

        <p className="text-center text-sm text-muted-foreground font-ui">
          {t("Don't have an account?", "অ্যাকাউন্ট নেই?")}{" "}
          <Link to="/auth/signup" className="text-primary font-medium hover:underline">
            {t("Sign up", "সাইন আপ করুন")}
          </Link>
        </p>
      </div>
    </div>
  );
}
