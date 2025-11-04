import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FreedomIndex from "@/components/FreedomIndex";
import FeaturedProperties from "@/components/FeaturedProperties";
import LifestyleSection from "@/components/LifestyleSection";
import BrokerSection from "@/components/BrokerSection";
import ExodusTestimonials from "@/components/ExodusTestimonials";
import LeadMagnet from "@/components/LeadMagnet";
import ContactSection from "@/components/ContactSection";
import PoliticianMeme from "@/components/PoliticianMeme";

const Index = () => {
  return (
    <main className="min-h-screen">
      <PoliticianMeme />
      <Navigation />
      <HeroSection />
      <FreedomIndex />
      <FeaturedProperties />
      <LifestyleSection />
      <BrokerSection />
      <ExodusTestimonials />
      <LeadMagnet />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 md:py-16">
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
                  South Florida's premier luxury real estate firm, specializing in coastal properties 
                  for discerning clients seeking exceptional lifestyle and investment opportunities.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  <li><a href="#properties" className="hover:text-primary-foreground transition-colors">Properties</a></li>
                  <li><a href="#markets" className="hover:text-primary-foreground transition-colors">Markets</a></li>
                  <li><a href="#about" className="hover:text-primary-foreground transition-colors">About</a></li>
                  <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  <li>650-229-4964</li>
                  <li>info@nyrefugee.com</li>
                  <li className="pt-2">Miami · Palm Beach · Boca Raton</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-primary-foreground/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
                <p>© 2025 Freedom Coast Luxury Realty. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
