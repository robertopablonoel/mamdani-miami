import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer K.",
    title: "Former Manhattan Resident",
    location: "Now residing in Miami Beach",
    quote: "The team at Freedom Coast made our relocation seamless. Their market expertise and understanding of our needs resulted in finding the perfect waterfront property. The lifestyle change has exceeded our expectations.",
    year: "2024"
  },
  {
    name: "Michael R.",
    title: "Entrepreneur & Family Man",
    location: "Relocated to Palm Beach",
    quote: "After extensive research, we chose Florida for its business climate and quality of life. Our agent provided invaluable guidance throughout the entire process. Couldn't be happier with our decision.",
    year: "2024"
  },
  {
    name: "David & Sarah L.",
    title: "Investment Professionals",
    location: "New home in Boca Raton",
    quote: "The financial advantages combined with the superior lifestyle made this an easy choice. Freedom Coast's professionalism and deep market knowledge were instrumental in our successful transition.",
    year: "2024"
  }
];

const ExodusTestimonials = () => {
  return (
    <section className="py-32 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trusted by discerning clients who value expertise, discretion, and exceptional results 
            in their South Florida real estate journey.
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
