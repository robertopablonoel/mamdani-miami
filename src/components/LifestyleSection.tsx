import { memo } from "react";
import lifestyleMiamiImage from "@/assets/lifestyle-miami-terrace.jpg";
import lifestylePalmBeachImage from "@/assets/lifestyle-palm-beach-pool.jpg";

const benefits = [
  { number: "300+", label: "Days of Sunshine" },
  { number: "0%", label: "State Income Tax" },
  { number: "✓", label: "Pro Business Regulations" },
  { number: "75°F", label: "Average Temperature" },
  { number: "∞", label: "Lifestyle Possibilities" }
];

const LifestyleSection = memo(() => {
  return (
    <section className="py-10 md:py-14 lg:py-18 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8 md:mb-10 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
            Live the Florida Lifestyle You Deserve
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
            More than real estate. A complete transformation of how you live, work, and enjoy life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Miami Lifestyle */}
          <div className="relative overflow-hidden rounded-lg shadow-elegant group animate-fade-in">
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={lifestyleMiamiImage}
                alt="Florida lifestyle after moving from New York - luxury Miami penthouse terrace with ocean views and year-round sunshine"
                loading="lazy"
                decoding="async"
                width="1600"
                height="1000"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Urban Sophistication</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Miami's vibrant culture, world-class dining, and stunning waterfront views
                </p>
              </div>
            </div>
          </div>

          {/* Palm Beach Lifestyle */}
          <div className="relative overflow-hidden rounded-lg shadow-elegant group animate-fade-in">
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={lifestylePalmBeachImage}
                alt="Palm Beach Florida living - luxury oceanfront pool and pro-business lifestyle for New York relocators"
                loading="lazy"
                decoding="async"
                width="1600"
                height="1000"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Coastal Tranquility</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Palm Beach's pristine beaches, championship golf, and refined elegance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto mt-8 md:mt-10 animate-fade-in">
          {benefits.map((item, idx) => (
            <div 
              key={idx}
              className={`text-center p-4 md:p-6 bg-muted/30 rounded-lg hover:-translate-y-1 transition-smooth ${idx === 4 ? 'hidden md:block' : ''}`}
            >
              <div className="text-2xl md:text-4xl font-serif text-primary mb-2">{item.number}</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

LifestyleSection.displayName = "LifestyleSection";

export default LifestyleSection;
