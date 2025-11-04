import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
              Begin Your Journey
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Connect with our experienced team to discuss your South Florida real estate goals. 
              We provide personalized service and market insights tailored to your unique requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <Card className="shadow-elegant border-0">
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
                        <a href="tel:+1-650-229-4964" className="text-muted-foreground hover:text-primary transition-colors">
                          650-229-4964
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
                        <a href="mailto:info@nyrefugee.com" className="text-muted-foreground hover:text-primary transition-colors">
                          info@nyrefugee.com
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

              <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:p-8 rounded-lg border border-primary/20 shadow-elegant">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>100% Confidential Service</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Guaranteed
                      </span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All inquiries are handled with complete discretion. We understand the importance of privacy in luxury real estate transactions and protect your information with the highest standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-elegant border-0">
              <CardContent className="p-6 md:p-8">
                <form className="space-y-4 md:space-y-6">
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

                  <Button type="button" variant="premium" size="lg" className="w-full h-14 text-base" asChild>
                    <a href="https://calendly.com/julie-nyrefugee/30min" target="_blank" rel="noopener noreferrer">
                      Request Free Consultation
                    </a>
                  </Button>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span> No obligation
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span> 100% confidential
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
