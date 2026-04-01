import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Directory from "./pages/Directory";
import BusinessProfile from "./pages/BusinessProfile";
import Startups from "./pages/Startups";
import Pricing from "./pages/Pricing";
import Tools from "./pages/Tools";
import About from "./pages/About";
import AuthLogin from "./pages/AuthLogin";
import AuthSignup from "./pages/AuthSignup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={
                <>
                  <Navbar />
                  <Routes>
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
