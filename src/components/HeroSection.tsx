import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-miami-sunset.jpg";
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-white leading-tight text-balance px-2">Florida, where success is still legal...</h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white/95 leading-tight text-balance px-2 mt-4">Relocate before Your Tax Bracket Becomes a Moral Issue.</h2>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto pt-6 md:pt-8 px-4">
          {[{
            stat: "Tax Freedom",
            label: "0% State Income Tax"
          }, {
            stat: "Year-Round Paradise",
            label: "230+ Sunny Days"
          }, {
            stat: "Business Friendly",
            label: "Entrepreneur Haven"
          }].map((item, idx) => <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-6 md:p-8 rounded-lg">
                <div className="text-2xl sm:text-2xl md:text-4xl font-serif text-white mb-2 md:mb-2">{item.stat}</div>
                <div className="text-sm sm:text-sm text-white/80 uppercase tracking-wider">{item.label}</div>
              </div>)}
          </div>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed px-4">We help New Yorkers relocate before Socialism takes over and the next wealth tax proposal drops.</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-4 justify-center items-stretch sm:items-center pt-4 md:pt-4 px-4">
            <Button size="lg" variant="secondary" className="text-base sm:text-base px-8 sm:px-10 py-6 sm:py-6 h-auto sm:h-14 w-full sm:w-auto">
              Explore Refuge Properties
              <ArrowRight className="ml-2 w-5 sm:w-5 h-5 sm:h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base sm:text-base px-8 sm:px-10 py-6 sm:py-6 h-auto sm:h-14 w-full sm:w-auto border-white/60 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-primary">
              Speak with an Agent
            </Button>
          </div>
          
          {/* Trust Badge */}
          <div className="pt-6 md:pt-8 px-4">
            <p className="text-white/70 text-sm sm:text-lg uppercase tracking-widest font-bold">"Now my biggest problem is sunscreen, not socialism." - Michael R</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        
        
      </div>
    </section>;
};
export default HeroSection;