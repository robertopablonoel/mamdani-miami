import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import palmBeachImage from "@/assets/property-palm-beach.jpg";
import miamiPenthouseImage from "@/assets/property-miami-penthouse.jpg";
import bocaRatonImage from "@/assets/property-boca-raton.jpg";

const properties = [
  {
    id: 1,
    image: palmBeachImage,
    title: "The Liberation Villa",
    location: "Palm Beach, FL",
    price: "$12,950,000",
    beds: 6,
    baths: 7,
    sqft: "8,500",
    description: "Oceanfront sanctuary with zero state income tax and 300 days of sunshine. Your former NYC apartment could fit in the master closet.",
    badge: "Tax-Free Living"
  },
  {
    id: 2,
    image: miamiPenthouseImage,
    title: "The Exodus Penthouse",
    location: "Miami Beach, FL",
    price: "$8,750,000",
    beds: 4,
    baths: 5,
    sqft: "5,200",
    description: "Floor-to-ceiling views of your new life. No more subway rats, just yacht clubs and endless ocean horizons.",
    badge: "Freedom Floors"
  },
  {
    id: 3,
    image: bocaRatonImage,
    title: "The Defector's Dream",
    location: "Boca Raton, FL",
    price: "$6,500,000",
    beds: 5,
    baths: 6,
    sqft: "7,000",
    description: "Mediterranean masterpiece with private yacht dock. Finally, a place to park something bigger than a CitiBike.",
    badge: "Yacht Included"
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Your Freedom Awaits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked estates for discerning New Yorkers who've had enough. 
            Each property comes with guaranteed sunshine and zero progressive policies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden shadow-elegant hover:shadow-hover transition-smooth group">
              <div className="relative overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-elegant">
                  {property.badge}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </CardDescription>
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary">{property.price}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds} beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths} baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>

                <Button variant="default" className="w-full">
                  Schedule Liberation Tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="luxury" size="lg" className="text-lg">
            View All Escape Routes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
