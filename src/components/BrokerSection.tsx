import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const BrokerSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/5] bg-muted rounded overflow-hidden shadow-elegant">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm uppercase tracking-wider">Broker Photo</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground px-2">
                Meet [Broker Name], Your Escape Facilitator.
              </h2>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-2">
                She's helped countless New Yorkers find refuge in South Florida's luxury market. Whether you want a Brickell penthouse, Boca golf villa, or Palm Beach mansion, she'll make your move painless and profitable.
              </p>

              <div className="space-y-4 md:space-y-6 mt-4 md:mt-6">
                {/* Credentials */}
                <div className="flex flex-wrap gap-2 md:gap-3 px-2">
                  <div className="bg-accent px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-foreground border border-border">
                    15+ Years Experience
                  </div>
                  <div className="bg-accent px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-foreground border border-border">
                    250+ Closed Deals
                  </div>
                  <div className="bg-accent px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-foreground border border-border">
                    Luxury Specialist
                  </div>
                </div>
                
                <Button size="lg" variant="secondary" className="h-12 md:h-14 px-8 md:px-10 w-full sm:w-auto text-sm md:text-base">
                  Book an Exit Strategy Call
                  <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
                </Button>
                
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 px-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available for consultation · Response within 2 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrokerSection;
