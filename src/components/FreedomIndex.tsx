import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { memo } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";

const benefits = [
  "0% state income tax", 
  "Year-round summer", 
  "Predictable regulations", 
  "Luxury properties that appreciate faster than NYC rent boards"
];

const FreedomIndex = memo(() => {
  return <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div className="max-w-4xl mx-auto text-center mb-6 md:mb-8" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
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
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {benefits.map((benefit, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: idx * 0.1
          }}>
                <Card className="shadow-elegant border-0 h-full hover:shadow-hover transition-smooth">
                  <CardContent className="p-4 md:p-5 flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base text-foreground">{benefit}</p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>

        <div className="text-center mt-6 md:mt-8 px-4">
          <Button size="default" variant="premium" className="h-11 px-6 w-full sm:w-auto" asChild>
            <a href="https://calendly.com/julie-nyrefugee/30min" target="_blank" rel="noopener noreferrer">
              Schedule Consultation
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Successful relocations are our thing.</p>
        </div>
      </div>
    </section>;
});

FreedomIndex.displayName = "FreedomIndex";

export default FreedomIndex;