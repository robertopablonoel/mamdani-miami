import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingUp } from "lucide-react";

const FreedomIndex = () => {
  const comparisons = [
    { metric: "State Income Tax", ny: "Up to 10.9%", fl: "0%", savings: "$54,500/year*" },
    { metric: "Property Tax (Luxury)", ny: "$45,000/year", fl: "$32,000/year", savings: "$13,000/year" },
    { metric: "Cost of Living Index", ny: "187.2", fl: "102.8", savings: "45% lower" },
    { metric: "Annual Sunshine", ny: "224 days", fl: "320 days", savings: "+96 days" },
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
            The Florida Advantage
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A comprehensive analysis for New York residents considering relocation to South Florida's 
            luxury real estate market.
          </p>
        </div>

        <Card className="max-w-5xl mx-auto overflow-hidden shadow-elegant">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="text-left p-6 text-base font-semibold">Category</th>
                  <th className="text-center p-6 text-base font-semibold">New York</th>
                  <th className="text-center p-6 text-base font-semibold">Florida</th>
                  <th className="text-center p-6 text-base font-semibold">Benefit</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {comparisons.map((item, idx) => (
                  <tr 
                    key={idx}
                    className={`border-b border-border last:border-0 ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}
                  >
                    <td className="p-6 font-medium text-foreground">{item.metric}</td>
                    <td className="p-6 text-center text-muted-foreground">{item.ny}</td>
                    <td className="p-6 text-center font-medium text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{item.fl}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {item.savings}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-accent p-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              *Based on $500K annual income. Individual results vary. Consult with tax professionals for personalized guidance.
            </p>
          </div>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team provides comprehensive relocation support, including tax planning consultation, 
            market analysis, and personalized property recommendations tailored to your lifestyle and financial objectives.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreedomIndex;
