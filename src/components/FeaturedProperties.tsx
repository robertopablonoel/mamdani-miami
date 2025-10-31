import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import palmBeachImage from "@/assets/property-palm-beach.jpg";
import miamiPenthouseImage from "@/assets/property-miami-penthouse.jpg";
import bocaRatonImage from "@/assets/property-boca-raton.jpg";

const properties = [
  {
    id: 1,
    image: palmBeachImage,
    title: "Oceanfront Estate",
    location: "Palm Beach, Florida",
    price: "$12,950,000",
    beds: 6,
    baths: 7,
    sqft: "8,500",
    description: "Sophisticated beachfront residence featuring modern architecture, panoramic ocean views, and resort-style amenities.",
  },
  {
    id: 2,
    image: miamiPenthouseImage,
    title: "Luxury Penthouse",
    location: "Miami Beach, Florida",
    price: "$8,750,000",
    beds: 4,
    baths: 5,
    sqft: "5,200",
    description: "Exclusive penthouse with floor-to-ceiling windows, private terrace, and unobstructed Biscayne Bay vistas.",
  },
  {
    id: 3,
    image: bocaRatonImage,
    title: "Waterfront Villa",
    location: "Boca Raton, Florida",
    price: "$6,500,000",
    beds: 5,
    baths: 6,
    sqft: "7,000",
    description: "Mediterranean-inspired estate with private yacht dock, lush landscaping, and championship golf course access.",
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="properties">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
            Featured Listings
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
            Curated selection of South Florida's finest coastal properties, 
            each representing the pinnacle of luxury living and architectural excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {properties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="overflow-hidden shadow-elegant hover:shadow-hover transition-smooth group border-0 h-full">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
                />
              </div>
              
              <CardContent className="p-6 md:p-8 space-y-4 md:space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3 md:mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm md:text-sm">{property.location}</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-serif text-primary mb-4 md:mb-4">{property.price}</p>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm md:text-sm">
                  {property.description}
                </p>

                <div className="flex items-center justify-between text-sm md:text-sm text-muted-foreground pt-4 md:pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    <span>{property.sqft} SF</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 md:mt-4 h-12 md:h-auto text-base md:text-base">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16 px-4">
          <Button variant="default" size="lg" className="w-full sm:w-auto h-14 md:h-auto text-base">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
