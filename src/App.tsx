import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import PublicLayout from "@/components/PublicLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
const Index = lazy(() => import("./pages/Index"));
const Directory = lazy(() => import("./pages/Directory"));
const BusinessProfile = lazy(() => import("./pages/BusinessProfile"));
const Startups = lazy(() => import("./pages/Startups"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Tools = lazy(() => import("./pages/Tools"));
const About = lazy(() => import("./pages/About"));
const AuthLogin = lazy(() => import("./pages/AuthLogin"));
const AuthSignup = lazy(() => import("./pages/AuthSignup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <ErrorBoundary>
              <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/startups" element={<Startups />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth/login" element={<AuthLogin />} />
                  <Route path="/auth/signup" element={<AuthSignup />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/:slug" element={<BusinessProfile />} />
                  <Route path="/bn" element={<Index />} />
                  <Route path="/bn/directory" element={<Directory />} />
                  <Route path="/bn/startups" element={<Startups />} />
                  <Route path="/bn/pricing" element={<Pricing />} />
                  <Route path="/bn/tools" element={<Tools />} />
                  <Route path="/bn/about" element={<About />} />
                  <Route path="/bn/:slug" element={<BusinessProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              </Suspense>
            </ErrorBoundary>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
