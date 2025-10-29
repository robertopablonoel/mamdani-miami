import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

const LeadMagnet = () => {
  return (
    <section className="py-32 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                The Great New York Exodus
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download our free guide: "10 Florida Neighborhoods Where Freedom Still Lives."
              </p>

              <form className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guide-email" className="sr-only">Email Address</Label>
                  <Input 
                    id="guide-email" 
                    type="email" 
                    placeholder="Enter your email address"
                    className="text-center"
                  />
                </div>

                <Button type="submit" size="lg" variant="default" className="w-full">
                  Send Me the Guide
                </Button>

                <p className="text-xs text-muted-foreground">
                  No spam. Just the truth about where to relocate.
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
