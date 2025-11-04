import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import brokerImage from "@/assets/broker-julie.jpg";
const BrokerSection = () => {
  return <section id="about" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Broker Image */}
            <motion.div className="relative aspect-[4/5] rounded overflow-hidden shadow-elegant" initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7
          }}>
              <img src={brokerImage} alt="Professional luxury real estate broker" className="w-full h-full object-cover" />
            </motion.div>

            {/* Content */}
            <motion.div className="space-y-4 md:space-y-6" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7,
            delay: 0.2
          }}>
              <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground px-2">Meet Julie, 
Your Escape Facilitator.</h2>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-2">She’s guided countless New Yorkers through the Great Resettlement, finding them refuge in South Florida's luxury market. Whether you want a Brickell penthouse, Boca golf villa, or Palm Beach mansion, she'll make your move painless and profitable.</p>

              <div className="space-y-5 md:space-y-6 mt-5 md:mt-6">
                {/* Credentials */}
                <div className="flex flex-wrap gap-3 md:gap-3 px-2">
                  <div className="bg-accent px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium text-foreground border border-border">Bespoke Experience</div>
                  <div className="bg-accent px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium text-foreground border border-border">Luxury Specialist</div>
                  <div className="bg-accent px-4 md:px-4 py-2 md:py-2 rounded-full text-sm md:text-sm font-medium text-foreground border border-border">Largest Broker In North America</div>
                </div>
                
                <Button size="lg" variant="secondary" className="h-14 md:h-14 px-8 md:px-10 w-full sm:w-auto text-base md:text-base" asChild>
                  <a href="https://calendly.com/julie-nyrefugee/30min" target="_blank" rel="noopener noreferrer">
                    Book an Exit Strategy Call
                    <ArrowRight className="ml-2 w-5 md:w-5 h-5 md:h-5" />
                  </a>
                </Button>
                
                <p className="text-sm md:text-sm text-muted-foreground flex items-center gap-2 px-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available for consultation · Responds within 1 hour
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};
export default BrokerSection;