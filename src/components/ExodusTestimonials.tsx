import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer K.",
    title: "Former Manhattan Resident",
    location: "Now residing in Miami Beach",
    quote: "I traded my Brooklyn brownstone for ocean views and no property board drama.",
    year: "2024"
  },
  {
    name: "Michael R.",
    title: "Entrepreneur & Family Man",
    location: "Relocated to Palm Beach",
    quote: "Now my biggest problem is sunscreen, not socialism.",
    year: "2024"
  },
  {
    name: "David & Sarah L.",
    title: "Investment Professionals",
    location: "New home in Boca Raton",
    quote: "Best financial decision we ever made. And the weather doesn't hurt either.",
    year: "2024"
  }
];

const ExodusTestimonials = () => {
  return (
    <section className="py-32 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Freedom Stories from Former New Yorkers
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real people. Real escapes. Real estate that makes sense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="shadow-elegant bg-card border-0">
              <CardContent className="p-10 space-y-6">
                <Quote className="w-10 h-10 text-primary/20" />

                <blockquote className="text-foreground leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="pt-6 border-t border-border space-y-1">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location} · {testimonial.year}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExodusTestimonials;
