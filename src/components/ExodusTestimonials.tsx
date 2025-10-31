import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
const testimonials = [{
  name: "Jennifer K.",
  title: "Former Manhattan Resident",
  location: "Now residing in Miami Beach",
  quote: "I traded my Brooklyn brownstone for ocean views and no property board drama.",
  year: "2024"
}, {
  name: "Michael R.",
  title: "Entrepreneur & Family Man",
  location: "Relocated to Palm Beach",
  quote: "Now my biggest problem is sunscreen, not socialism.",
  year: "2024"
}, {
  name: "David & Sarah L.",
  title: "Investment Professionals",
  location: "New home in Boca Raton",
  quote: "Best financial decision we ever made. And the weather doesn't hurt either.",
  year: "2024"
}];
const ExodusTestimonials = () => {
  return <section className="py-16 md:py-24 lg:py-32 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">Freedom Stories From 
Former New Yorkers</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
            Real people. Real escapes. Real estate that makes sense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => <motion.div key={idx} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: idx * 0.15
        }}>
              <Card className="shadow-elegant hover:shadow-hover transition-smooth bg-card border-0 group h-full">
                <CardContent className="p-6 md:p-10 space-y-4 md:space-y-6">
                <div className="flex items-start justify-between">
                  <Quote className="w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-smooth" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-secondary" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>)}
                  </div>
                </div>

                <blockquote className="text-foreground leading-relaxed text-base md:text-lg">
                  "{testimonial.quote}"
                </blockquote>

                <div className="pt-6 border-t border-border space-y-1">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location} · {testimonial.year}</p>
                  <p className="text-xs text-primary font-medium mt-2">✓ Verified Client</p>
                </div>
              </CardContent>
            </Card>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default ExodusTestimonials;