import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { trackPhoneClick, trackCTAClick } from "@/lib/analytics";

const Navigation = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const scrollToCalendly = (source: 'nav_desktop' | 'nav_mobile') => {
    trackCTAClick('Schedule Consultation', source);
    closeMobileMenu();
    // Small delay to allow menu to close on mobile
    setTimeout(() => {
      document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, source === 'nav_mobile' ? 300 : 0);
  };

  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-serif font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">
              FREEDOM COAST
              <span className="block text-[10px] md:text-xs font-sans font-normal tracking-widest text-muted-foreground mt-0.5">
                LUXURY REALTY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <a href="#about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  About
                </a>
                <a href="#freedom-stories" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Freedom Stories
                </a>
                <a href="#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </>
            ) : (
              <>
                <Link to="/#about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/#freedom-stories" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Freedom Stories
                </Link>
                <Link to="/#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="default" asChild>
              <a href="tel:+17872431212" className="flex items-center gap-2" onClick={() => trackPhoneClick()}>
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </Button>
            <Button variant="default" size="default" onClick={() => scrollToCalendly('nav_desktop')}>
              Schedule Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2 text-foreground hover:text-primary transition-colors" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {isHomePage ? (
                <>
                  <a href="#about" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    About
                  </a>
                  <a href="#freedom-stories" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    Freedom Stories
                  </a>
                  <a href="#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    Contact
                  </a>
                </>
              ) : (
                <>
                  <Link to="/#about" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    About
                  </Link>
                  <Link to="/#freedom-stories" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    Freedom Stories
                  </Link>
                  <Link to="/#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                </>
              )}
              <Button variant="outline" size="lg" className="w-full mt-2" asChild>
                <a href="tel:+17872431212" className="flex items-center justify-center gap-2" onClick={() => trackPhoneClick()}>
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </Button>
              <Button variant="default" size="lg" className="w-full" onClick={() => scrollToCalendly('nav_mobile')}>
                Schedule Consultation
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
});

Navigation.displayName = "Navigation";

export default Navigation;