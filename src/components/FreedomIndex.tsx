import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp } from "lucide-react";

const FreedomIndex = () => {
  const benefits = [
    "0% state income tax",
    "Year-round summer",
    "Predictable regulations",
    "Luxury properties that appreciate faster than NYC rent boards"
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <TrendingUp className="w-3 md:w-4 h-3 md:h-4" />
            <span>Market Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
            Low Taxes, High Sunshine, No Committees on Economic Justice.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
            Why Florida? The answer writes itself:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="shadow-elegant border-0">
                <CardContent className="p-5 md:p-8 flex items-start gap-3 md:gap-4">
                  <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-primary flex-shrink-0 mt-0.5 md:mt-1" />
                  <p className="text-base md:text-lg text-foreground">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16 space-y-3 md:space-y-4 px-4">
          <Button size="lg" variant="premium" className="h-12 md:h-14 px-8 md:px-12 w-full sm:w-auto text-sm md:text-base">
            See Available Homes
          </Button>
          <p className="text-xs md:text-sm text-muted-foreground">
            💎 Over <strong className="text-foreground">$850M</strong> in successful relocations
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreedomIndex;
