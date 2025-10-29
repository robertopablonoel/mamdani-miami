import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer K.",
    previousLocation: "Upper West Side → Miami Beach",
    quote: "I thought giving up my rent-controlled apartment was crazy. Turns out, what's crazy is paying $4,000/month for 400 square feet. Now I have an ocean view and my accountant sends me thank-you cards.",
    rating: 5,
    savings: "$127K/year"
  },
  {
    name: "Michael R.",
    previousLocation: "Brooklyn → Palm Beach",
    quote: "After the election results, my wife and I looked at each other and said 'It's time.' Three weeks later, we closed on a waterfront estate. Best impulse decision we've ever made. The golf courses alone make it worth it.",
    rating: 5,
    savings: "$215K/year"
  },
  {
    name: "David & Sarah L.",
    previousLocation: "Tribeca → Boca Raton",
    quote: "We stayed for the bagels. We left for literally everything else. Turns out Florida has bagels too, plus you can actually park your car without selling a kidney.",
    rating: 5,
    savings: "$180K/year"
  }
];

const ExodusTestimonials = () => {
  return (
    <section className="py-24 gradient-luxury">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Exodus Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real New Yorkers who made the leap. Their accountants are thrilled. 
            Their vitamin D levels are optimal. Their only regret? Not doing it sooner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="shadow-elegant hover:shadow-hover transition-smooth bg-card">
              <CardContent className="p-8 space-y-4">
                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.previousLocation}</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold">Annual Tax Savings: {testimonial.savings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            *Tax savings calculated using complex formulas including "what we used to pay" minus "what we pay now" 
            plus "the peace of mind of not being governed by Zohran Mamdani."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExodusTestimonials;
