import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-32 bg-background" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              Begin Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with our experienced team to discuss your South Florida real estate goals. 
              We provide personalized service and market insights tailored to your unique requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="shadow-elegant border-0">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
                        <a href="tel:+1-888-555-0123" className="text-muted-foreground hover:text-primary transition-colors">
                          888-555-0123
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">Available 7 days a week</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-8 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Email</h3>
                        <a href="mailto:info@freedomcoastrealty.com" className="text-muted-foreground hover:text-primary transition-colors">
                          info@freedomcoastrealty.com
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-8 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Offices</h3>
                        <p className="text-muted-foreground">
                          Miami Beach<br />
                          Palm Beach<br />
                          Boca Raton
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-accent p-6 rounded border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Confidential Service:</strong> All inquiries are handled with complete discretion. 
                  We understand the importance of privacy in luxury real estate transactions.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-elegant border-0">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Smith" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.smith@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input id="location" placeholder="e.g., New York, NY" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Investment Range</Label>
                    <Input id="budget" placeholder="e.g., $2M - $5M" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please share details about your real estate objectives and timeline..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" variant="premium" size="lg" className="w-full h-14">
                    Request Free Consultation
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-500">✓</span> No obligation
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-500">✓</span> 100% confidential
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-green-500">✓</span> 2-hour response
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
