import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-xl md:text-2xl font-serif font-bold tracking-tight text-primary">
              FREEDOM COAST
              <span className="block text-[10px] md:text-xs font-sans font-normal tracking-widest text-muted-foreground mt-0.5">
                LUXURY REALTY
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#properties" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Properties
            </a>
            
            <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+1-650-229-4964" className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span>650-229-4964</span>
            </a>
            <Button variant="default" size="sm">
              Schedule Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground hover:text-primary transition-colors" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#properties" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Properties
              </a>
              <a href="#markets" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Markets
              </a>
              <a href="#about" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <a href="#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
              <a href="tel:+1-650-229-4964" className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary transition-colors py-2">
                <Phone className="w-5 h-5" />
                <span>650-229-4964</span>
              </a>
              <Button variant="default" size="lg" className="w-full mt-2">
                Schedule Consultation
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;