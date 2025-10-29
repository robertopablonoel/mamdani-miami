import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-miami-sunset.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Alert Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-6 py-3 rounded-full shadow-elegant animate-fade-in">
            <span className="text-lg font-semibold">🚨 BREAKING</span>
            <span className="text-sm">The Great New York Exodus Has Begun</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight animate-fade-in">
            Your Escape Plan
            <span className="block gradient-sunset bg-clip-text text-transparent mt-2">
              Awaits in Florida
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Trade rent control for ocean views. Exchange gridlock for golf courses. 
            Welcome to zero state income tax, year-round sunshine, and actual freedom.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in">
            {[
              { stat: "0%", label: "State Income Tax" },
              { stat: "320+", label: "Sunny Days/Year" },
              { stat: "$2.8M", label: "Avg Tax Savings" }
            ].map((item, idx) => (
              <div key={idx} className="bg-card/90 backdrop-blur-sm p-6 rounded-lg shadow-elegant">
                <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6">
              Browse Freedom Properties
              <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="luxury" className="text-lg px-8 py-6">
              Calculate My Tax Savings
            </Button>
          </div>

          {/* Tongue-in-cheek disclaimer */}
          <p className="text-sm text-white/70 italic max-w-lg mx-auto animate-fade-in">
            *Not financial or political advice. But seriously, have you seen the property taxes up there?
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
