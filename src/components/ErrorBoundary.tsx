import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-context";

export default function ErrorFallback({ error, reset }: { error: Error; reset?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>Something went wrong — BanglaHQ</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="text-center max-w-md">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
          {t("Something went wrong", "কিছু গেয়ে গেছে")}
        </h1>
        <p className="text-muted-foreground font-ui text-sm mb-6">
          {t(
            "We couldn't load this page. Please try again.",
            "আমরা এই পেজ লোড করতে পারিনি। আবার চেষ্টা করুন।"
          )}
        </p>
        {error.message && (
          <pre className="text-left text-xs font-mono bg-muted rounded-lg p-3 mb-6 text-destructive">
            {error.message}
          </pre>
        )}
        <Link to="/" className="text-primary underline hover:text-primary/90 font-ui">
          {t("Return to Home", "হোমে ফিরে যান")}
        </Link>
        {reset && (
          <button
            onClick={reset}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground font-ui transition-colors"
          >
            {t("Try again", "আবার চেষ্টা করুন")}
          </button>
        )}
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }
  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} reset={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}
