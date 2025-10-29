import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-miami-sunset.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-white leading-tight text-balance">
            Millions Are Fleeing. Beat the Traffic.
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            When rent freezes meet grocery socialism, it's time to head south. We help New Yorkers relocate before the next wealth tax proposal drops.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
            {[
              { stat: "$850M+", label: "In Closed Sales" },
              { stat: "250+", label: "Luxury Properties" },
              { stat: "15 Years", label: "Market Expertise" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded">
                <div className="text-4xl md:text-5xl font-serif text-white mb-2">{item.stat}</div>
                <div className="text-sm text-white/80 uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" variant="default" className="text-base px-10 py-6">
              Explore Refuge Properties
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-10 py-6 border-white text-white hover:bg-white hover:text-primary">
              Speak with an Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="text-white/60 text-xs uppercase tracking-widest mb-3">Explore</div>
        <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
