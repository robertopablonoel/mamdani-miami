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
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Market Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Low Taxes, High Sunshine, No Committees on Economic Justice.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Why Florida? The answer writes itself:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="shadow-elegant border-0">
                <CardContent className="p-8 flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 space-y-4">
          <Button size="lg" variant="premium" className="h-14 px-12">
            See Available Homes
          </Button>
          <p className="text-sm text-muted-foreground">
            💎 Over <strong className="text-foreground">$850M</strong> in successful relocations
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreedomIndex;
