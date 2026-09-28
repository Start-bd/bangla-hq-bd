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

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (hasError && error) {
      console.error("ErrorBoundary caught:", error);
    }
  }, [hasError, error]);

  if (hasError) {
    return <ErrorFallback error={error ?? new Error("Unknown error")} />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
