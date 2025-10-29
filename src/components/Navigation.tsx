import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-serif font-bold tracking-tight text-primary">
              FREEDOM COAST
              <span className="block text-xs font-sans font-normal tracking-widest text-muted-foreground mt-0.5">
                LUXURY REALTY
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#properties" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Properties
            </a>
            <a href="#markets" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Markets
            </a>
            <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a href="tel:+1-888-555-0123" className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span>888-555-0123</span>
            </a>
            <Button variant="default" size="sm">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
