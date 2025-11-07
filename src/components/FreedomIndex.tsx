import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";

const benefits = [
  "0% State Income Tax", 
  "Year-Round Summer", 
  "Pro Business Regulations", 
  "Well Funded Police"
];

const FreedomIndex = memo(() => {
  const scrollToCalendly = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <section className="py-6 md:py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
            <TrendingUp className="w-3 h-3" />
            <span>Market Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-3 px-2">
            Low Taxes, High Sunshine, No Committees on Economic Justice.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Why Florida? The answer writes itself:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {benefits.map((benefit, idx) => <div key={idx} className="animate-fade-in">
                <Card className="shadow-elegant border-0 h-full hover:shadow-hover transition-smooth bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-4 flex items-center justify-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm md:text-base text-foreground/90 font-light whitespace-nowrap">{benefit}</p>
                  </CardContent>
                </Card>
              </div>)}
          </div>
        </div>

        <div className="text-center mt-4 md:mt-6 px-4">
          <Button size="default" variant="secondary" className="h-11 px-6 w-full sm:w-auto" onClick={scrollToCalendly}>
            Explore Your Options
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Successful relocations are our thing.</p>
        </div>
      </div>
    </section>;
});

FreedomIndex.displayName = "FreedomIndex";

export default FreedomIndex;