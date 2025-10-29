import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

const FreedomIndex = () => {
  const comparisons = [
    { metric: "State Income Tax", ny: "10.9%", fl: "0%", winner: "fl" },
    { metric: "Average Sunny Days", ny: "224", fl: "320", winner: "fl" },
    { metric: "Winter Temperature", ny: "33°F", fl: "68°F", winner: "fl" },
    { metric: "Beach Proximity", ny: "Subway ride + ferry", fl: "Walk outside", winner: "fl" },
    { metric: "Political Climate", ny: "Mamdani Era", fl: "DeSantis Country", winner: "fl" },
    { metric: "Cost of Breathing Room", ny: "$4,500/mo studio", fl: "$4,500/mo penthouse", winner: "fl" },
    { metric: "Brunch Wait Time", ny: "2.5 hours", fl: "Walk right in", winner: "fl" },
    { metric: "State Motto Accuracy", ny: "Excelsior (debatable)", fl: "In God We Trust (& beaches)", winner: "fl" },
  ];

  return (
    <section className="py-24 gradient-ocean">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            The Freedom Index™
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A completely unbiased, 100% objective comparison of your current situation 
            versus your imminent Florida future.
          </p>
        </div>

        <Card className="max-w-5xl mx-auto overflow-hidden shadow-hover">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="gradient-luxury">
                <tr>
                  <th className="text-left p-6 text-lg font-semibold text-foreground">Metric</th>
                  <th className="text-center p-6 text-lg font-semibold text-foreground">New York</th>
                  <th className="text-center p-6 text-lg font-semibold text-foreground">Florida</th>
                  <th className="text-center p-6 text-lg font-semibold text-foreground">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr 
                    key={idx}
                    className={`border-t ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'} hover:bg-accent/20 transition-smooth`}
                  >
                    <td className="p-6 font-medium">{item.metric}</td>
                    <td className="p-6 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <span>{item.ny}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-primary font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span>{item.fl}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full gradient-sunset text-white font-bold text-lg">
                        FL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="gradient-sunset p-6 text-center">
            <p className="text-white text-lg font-semibold">
              Final Score: Florida 8, New York 0 
              <span className="text-sm ml-2 opacity-90">(We're as shocked as you are)</span>
            </p>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground italic max-w-xl mx-auto">
            *This index uses advanced metrics including "vibes," "general consensus among people who left," 
            and "that thing your cousin said at Thanksgiving."
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreedomIndex;
