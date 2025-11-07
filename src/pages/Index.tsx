import { lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { useScrollTracking } from "@/hooks/useScrollTracking";

// Lazy load all below-the-fold components for faster initial load
const FreedomIndex = lazy(() => import("@/components/FreedomIndex"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const LifestyleSection = lazy(() => import("@/components/LifestyleSection"));
const BrokerSection = lazy(() => import("@/components/BrokerSection"));
const ExodusTestimonials = lazy(() => import("@/components/ExodusTestimonials"));
const FeaturedProperties = lazy(() => import("@/components/FeaturedProperties"));
const PoliticianMeme = lazy(() => import("@/components/PoliticianMeme"));

const ComponentLoader = () => (
  <div className="w-full h-20 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = memo(() => {
  // Track scroll depth for analytics
  useScrollTracking();
  
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <PoliticianMeme />
      </Suspense>
      <Navigation />
      <HeroSection />
      <Suspense fallback={<ComponentLoader />}>
        <FreedomIndex />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <LifestyleSection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <BrokerSection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <ExodusTestimonials />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <FeaturedProperties />
      </Suspense>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="text-2xl font-serif font-bold mb-4">
                  FREEDOM COAST
                  <span className="block text-xs font-sans font-normal tracking-widest opacity-80 mt-1">
                    LUXURY REALTY
                  </span>
                </div>
                <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-md">
                  South Florida's premier escape facilitator for discerning clients seeking exceptional lifestyle and investment opportunities.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  <li><a href="#properties" className="hover:text-primary-foreground transition-colors">Properties</a></li>
                  <li><a href="/auth" className="hover:text-primary-foreground transition-colors">Admin</a></li>
                  <li><a href="#about" className="hover:text-primary-foreground transition-colors">About</a></li>
                  <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  <li>info@nyrefugee.com</li>
                  <li className="pt-2">Miami · Palm Beach · Boca Raton</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-primary-foreground/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
                <p>© 2025 Freedom Coast Luxury Realty. All rights reserved.</p>
                <div className="flex gap-6">
                  <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
                </div>
              </div>
              <div className="mt-4 text-xs text-primary-foreground/50 text-center">
                <p>Erant Properties | Sales Associate License #SL3631128 | Brokerage License #BK3296946</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
});

Index.displayName = "Index";

export default Index;
