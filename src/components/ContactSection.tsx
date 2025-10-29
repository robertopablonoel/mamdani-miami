import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to Defect?
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Let's get you out of there. Our team of former New Yorkers understands your pain, 
                  your frustration, and your tax bracket. We're here to help.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Call the Freedom Hotline</h3>
                      <p className="text-muted-foreground text-sm mb-2">Available 24/7 for urgent relocations</p>
                      <a href="tel:+1-888-FREEDOM" className="text-primary font-semibold hover:underline">
                        1-888-FREEDOM-NOW
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm mb-2">We'll respond faster than your landlord</p>
                      <a href="mailto:escape@freedomcoastrealty.com" className="text-primary font-semibold hover:underline">
                        escape@freedomcoastrealty.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Visit Our Offices</h3>
                      <p className="text-muted-foreground text-sm">
                        Miami Beach | Palm Beach | Boca Raton
                        <br />
                        <span className="italic">(No NYC office – we escaped too)</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-accent/50 p-6 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground">
                  <strong className="text-primary">Exodus Fast Track™:</strong> Submit your info now and we'll 
                  have property recommendations ready before your lease renewal notice arrives.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <Card className="shadow-hover">
              <CardHeader>
                <CardTitle className="text-2xl">Start Your Escape Plan</CardTitle>
                <CardDescription>Fill out the form below and let freedom ring.</CardDescription>
              </CardHeader>
              <CardContent>
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
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.smith@escapingnyc.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentLocation">Current NY Location</Label>
                    <Input id="currentLocation" placeholder="e.g., Upper East Side, Brooklyn" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Input id="budget" placeholder="e.g., $2M - $5M" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your escape plan</Label>
                    <Textarea 
                      id="message" 
                      placeholder="I can't take another winter. Also, I'd like a pool. And a yacht dock. And to never hear the phrase 'rent stabilization' again."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full text-lg">
                    Begin My Liberation Journey
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you acknowledge that you're ready to trade bagels for beaches, 
                    subway delays for yacht clubs, and Mamdani for Margaritas.
                  </p>
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
