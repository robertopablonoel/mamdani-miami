import HeroSection from "@/components/HeroSection";
import FreedomIndex from "@/components/FreedomIndex";
import FeaturedProperties from "@/components/FeaturedProperties";
import ExodusTestimonials from "@/components/ExodusTestimonials";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FreedomIndex />
      <FeaturedProperties />
      <ExodusTestimonials />
      <ContactSection />
      
      {/* Footer */}
      <footer className="gradient-sunset py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold text-white">
              Freedom Coast Realty
            </h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Helping New Yorkers escape to paradise since November 2024. 
              Licensed real estate professionals with a sense of humor and a passion for low taxes.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <a href="#" className="hover:text-white transition-colors">Properties</a>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Tax Calculator</a>
              <a href="#" className="hover:text-white transition-colors">Relocation Guide</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                © 2025 Freedom Coast Realty. Not affiliated with any political campaigns, we just really love Florida.
              </p>
              <p className="text-white/60 text-xs mt-2 italic">
                This is a satirical website. All properties are fictional. Tax advice should come from actual accountants, 
                not websites with sunset gradients. But the beaches? Those are real.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
