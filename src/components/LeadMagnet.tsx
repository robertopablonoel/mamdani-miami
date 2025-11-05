import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const leadSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
});

type LeadFormData = z.infer<typeof leadSchema>;

const LeadMagnet = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-lead', {
        body: { email: data.email }
      });

      if (error) throw error;

      if (result?.error) {
        toast({
          title: "Please wait",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your guide is on its way to your inbox.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <section className="py-16 md:py-24 lg:py-32 gradient-premium relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-premium border-0 overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12 lg:p-16 text-center">
              <div className="w-20 md:w-24 h-20 md:h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-glow">
                <Download className="w-10 md:w-12 h-10 md:h-12 text-primary" />
              </div>

              <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-4 px-2">
                The Great New York Exodus
              </h2>
              
              <p className="text-lg sm:text-lg md:text-xl text-muted-foreground mb-4 md:mb-4 max-w-2xl mx-auto px-4">
                Download our exclusive guide: "10 Florida Neighborhoods Where Freedom Still Lives."
              </p>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4 md:space-y-4 px-4">
                <div className="space-y-2">
                  <Label htmlFor="guide-email" className="sr-only">Email Address</Label>
                  <Input 
                    id="guide-email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="h-14 md:h-14 text-center text-base md:text-lg border-2 focus:border-primary touch-manipulation" 
                    {...form.register("email")}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive text-center">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" size="lg" variant="secondary" className="w-full h-14 md:h-14 text-base md:text-lg font-medium touch-manipulation" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Me the Free Guide"}
                  <Download className="ml-2 w-5 md:w-5 h-5 md:h-5" />
                </Button>

                <p className="text-sm text-muted-foreground pt-2">🔒 No spam. Just the truth about where to relocate. 
Unsubscribe anytime.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default LeadMagnet;