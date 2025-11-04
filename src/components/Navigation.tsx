import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
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
                <a href="#properties" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Properties
                </a>
                <a href="#about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  About
                </a>
                <a href="#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </>
            ) : (
              <>
                <Link to="/#properties" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Properties
                </Link>
                <Link to="/#about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" size="default" asChild>
              <a href="https://calendly.com/julie-nyrefugee/30min" target="_blank" rel="noopener noreferrer">
                Schedule Consultation
              </a>
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
              {isHomePage ? (
                <>
                  <a href="#properties" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    Properties
                  </a>
                  <a href="#about" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </a>
                  <a href="#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </a>
                </>
              ) : (
                <>
                  <Link to="/#properties" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    Properties
                  </Link>
                  <Link to="/#about" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </Link>
                  <Link to="/#contact" className="text-base font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </Link>
                </>
              )}
              <Button variant="default" size="lg" className="w-full mt-2" asChild>
                <a href="https://calendly.com/julie-nyrefugee/30min" target="_blank" rel="noopener noreferrer">
                  Schedule Consultation
                </a>
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;