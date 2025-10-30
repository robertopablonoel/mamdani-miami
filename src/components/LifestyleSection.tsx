import { motion } from "framer-motion";
import lifestyleMiamiImage from "@/assets/lifestyle-miami-terrace.jpg";
import lifestylePalmBeachImage from "@/assets/lifestyle-palm-beach-pool.jpg";

const LifestyleSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
            Live the Florida Lifestyle You Deserve
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
            More than real estate. A complete transformation of how you live, work, and enjoy life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Miami Lifestyle */}
          <motion.div
            className="relative overflow-hidden rounded-lg shadow-elegant group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={lifestyleMiamiImage}
                alt="Luxury Miami lifestyle - couple enjoying sunset on penthouse terrace"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Urban Sophistication</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Miami's vibrant culture, world-class dining, and stunning waterfront views
                </p>
              </div>
            </div>
          </motion.div>

          {/* Palm Beach Lifestyle */}
          <motion.div
            className="relative overflow-hidden rounded-lg shadow-elegant group"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={lifestylePalmBeachImage}
                alt="Luxury Palm Beach lifestyle - family enjoying oceanfront pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Coastal Tranquility</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Palm Beach's pristine beaches, championship golf, and refined elegance
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { number: "300+", label: "Days of Sunshine" },
            { number: "0%", label: "State Income Tax" },
            { number: "75°F", label: "Average Temperature" },
            { number: "∞", label: "Lifestyle Possibilities" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="text-center p-4 md:p-6 bg-muted/30 rounded-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl md:text-4xl font-serif text-primary mb-2">{item.number}</div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleSection;
