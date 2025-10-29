import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const BrokerSection = () => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/5] bg-muted rounded overflow-hidden shadow-elegant">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm uppercase tracking-wider">Broker Photo</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                Meet [Broker Name], Your Escape Facilitator.
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                She's helped countless New Yorkers find refuge in South Florida's luxury market. Whether you want a Brickell penthouse, Boca golf villa, or Palm Beach mansion, she'll make your move painless and profitable.
              </p>

              <Button size="lg" variant="default" className="mt-4">
                Book an Exit Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrokerSection;
