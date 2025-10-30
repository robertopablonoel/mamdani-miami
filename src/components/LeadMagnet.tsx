import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

const LeadMagnet = () => {
  return (
    <section className="py-32 gradient-premium relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-premium border-0 overflow-hidden bg-white">
            <CardContent className="p-12 md:p-16 text-center">
              <div className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-8 shadow-glow">
                <Download className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                The Great New York Exodus
              </h2>
              
              <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
                Download our exclusive guide: "10 Florida Neighborhoods Where Freedom Still Lives."
              </p>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-2 mb-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <strong className="text-foreground">1,200+</strong> New Yorkers who downloaded this guide
                </p>
              </div>

              <form className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guide-email" className="sr-only">Email Address</Label>
                  <Input 
                    id="guide-email" 
                    type="email" 
                    placeholder="Enter your email address"
                    className="h-14 text-center text-lg border-2 focus:border-primary"
                  />
                </div>

                <Button type="submit" size="lg" variant="secondary" className="w-full h-14 text-lg">
                  Send Me the Free Guide
                  <Download className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground pt-2">
                  🔒 No spam. Just the truth about where to relocate. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
