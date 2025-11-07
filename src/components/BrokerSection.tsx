import { Button } from "@/components/ui/button";
import { memo } from "react";
import { ArrowRight } from "lucide-react";
import brokerImage from "@/assets/broker-julie-vest.png";

const BrokerSection = memo(() => {
  const scrollToCalendly = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <section id="about" className="py-10 md:py-14 lg:py-18 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Broker Image */}
            <div className="relative aspect-[3/4] rounded overflow-hidden shadow-elegant max-w-[50%] mx-auto md:max-w-[80%] md:mx-0 animate-fade-in">
              <img
                src={brokerImage} 
                alt="Julie - Expert Florida real estate broker specializing in New York to Florida relocation and luxury property sales" 
                loading="lazy"
                decoding="async"
                width="600"
                height="800"
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Content */}
            <div className="space-y-4 md:space-y-6 animate-fade-in">
              <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground px-2">Meet Julie, 
Your Escape Facilitator.</h2>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-2">She’s guided countless New Yorkers through the Great Resettlement, finding them refuge in South Florida's luxury market. Whether you want a Brickell penthouse, Boca golf villa, or Palm Beach mansion, she'll make your move painless and profitable.</p>

              <div className="space-y-5 md:space-y-6 mt-5 md:mt-6">
                <Button size="lg" variant="secondary" className="h-14 md:h-14 px-8 md:px-10 w-full sm:w-auto text-base md:text-base" onClick={scrollToCalendly}>
                  Book an Exit Strategy Call
                  <ArrowRight className="ml-2 w-5 md:w-5 h-5 md:h-5" />
                </Button>
                
                <p className="text-sm md:text-sm text-muted-foreground flex items-center gap-2 px-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available for consultation · Responds within 1 hour
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
});

BrokerSection.displayName = "BrokerSection";

export default BrokerSection;