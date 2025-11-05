import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { trackFormSubmission, trackPhoneClick } from "@/lib/analytics";
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().regex(/^[\d\s()+-]+$/, "Invalid phone format").min(10, "Phone too short").max(20, "Phone too long").optional().or(z.literal("")),
  location: z.string().max(200, "Location too long").optional(),
  investmentRange: z.string().max(100, "Investment range too long").optional(),
  message: z.string().max(2000, "Message too long").optional()
});
type FormData = z.infer<typeof formSchema>;
const ContactSection = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const {
        data: result,
        error
      } = await supabase.functions.invoke('submit-contact', {
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          investmentRange: data.investmentRange,
          message: data.message
        }
      });
      if (error) throw error;
      if (result?.error) {
        toast({
          title: "Please wait",
          description: result.error,
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Message sent!",
        description: "We'll respond within 1 hour."
      });
      trackFormSubmission('contact_form');
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="py-10 md:py-14 lg:py-18 bg-background" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 px-2">
              Begin Your Journey
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">Connect with our experienced team to discuss your South Florida relocation goals. We provide personalized service and market insights tailored to your unique requirements.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <Card className="shadow-elegant border-0">
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Email</h3>
                        <a href="mailto:julie@nyrefugee.com" className="text-muted-foreground hover:text-primary transition-colors">info@nyrefugee.com</a>
                        <p className="text-sm text-muted-foreground mt-1">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-8 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Phone</h3>
                        <a href="tel:+17872431212" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => trackPhoneClick()}>+1 (787) 243-1212</a>
                        <p className="text-sm text-muted-foreground mt-1">Available 9 AM - 6 PM EST</p>
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-base">First Name</Label>
                      <Input id="firstName" placeholder="John" className="h-12 md:h-11 text-base" {...register("firstName")} />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-base">Last Name</Label>
                      <Input id="lastName" placeholder="Smith" className="h-12 md:h-11 text-base" {...register("lastName")} />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.smith@example.com" className="h-12 md:h-11 text-base" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" className="h-12 md:h-11 text-base" {...register("phone")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base">Current Location</Label>
                    <Input id="location" placeholder="e.g., New York, NY" className="h-12 md:h-11 text-base" {...register("location")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentRange" className="text-base">Investment Range</Label>
                    <Input id="investmentRange" placeholder="e.g., $2M - $5M" className="h-12 md:h-11 text-base" {...register("investmentRange")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base">Message</Label>
                    <Textarea id="message" placeholder="Please share details about your real estate objectives and timeline..." rows={4} className="text-base min-h-[120px]" {...register("message")} />
                  </div>

                  <Button type="submit" variant="premium" size="lg" className="w-full h-14 text-base md:text-base font-medium" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </Button>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span> No obligation
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span> 100% confidential
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span> 1-hour response
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;