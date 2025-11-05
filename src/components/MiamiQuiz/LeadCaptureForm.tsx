import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadCaptureSchema, type LeadCaptureData } from '@/types/quiz';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { calculateSavings } from '@/lib/savingsCalculator';
import { trackEvent } from '@/lib/analytics';
import { QUIZ_COPY } from '@/content/quiz-copy';

interface Props {
  answers: QuizAnswers;
  sessionData: QuizSession;
  onSubmit: () => void;
}

export default function LeadCaptureForm({ answers, sessionData, onSubmit }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadCaptureData>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      first_name: '',
      email: '',
      phone: '',
      sms_consent: false,
    },
  });

  const handleSubmit = async (data: LeadCaptureData) => {
    setIsSubmitting(true);

    try {
      // Calculate savings
      const savings = calculateSavings(
        answers.income_bracket!,
        answers.monthly_cost!
      );

      // Submit to Edge Function
      const { data: result, error } = await supabase.functions.invoke('submit-quiz', {
        body: {
          session_id: sessionData.session_id,
          first_name: data.first_name,
          email: data.email,
          phone: data.phone || null,
          sms_consent: data.sms_consent,
          answers: answers,
          savings_calculation: {
            annual_savings: savings.annual_savings,
            tax_savings: savings.tax_savings,
            housing_savings: savings.housing_savings,
          },
        },
      });

      if (error) throw error;

      if (result?.error) {
        toast({
          title: 'Submission Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      // Track conversion
      trackEvent('lead_submit', {
        session_id: sessionData.session_id,
        tier: result.tier,
        annual_savings: savings.annual_savings,
      });

      toast({
        title: 'Success!',
        description: 'Calculating your personalized results...',
      });

      // Show results
      onSubmit();
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchPhone = form.watch('phone');

  return (
    <div className="min-h-screen gradient-premium flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <Card className="shadow-premium border-0 bg-white">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-3">
              {QUIZ_COPY.leadCapture.h1}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              {QUIZ_COPY.leadCapture.subhead}
            </p>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="First name"
                  className="mt-1"
                  {...form.register('first_name')}
                  disabled={isSubmitting}
                />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="mt-1"
                  {...form.register('email')}
                  disabled={isSubmitting}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1"
                  {...form.register('phone')}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  For faster callback from our Miami team
                </p>
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {watchPhone && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="sms_consent"
                    checked={form.watch('sms_consent')}
                    onCheckedChange={(checked) =>
                      form.setValue('sms_consent', checked === true)
                    }
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="sms_consent" className="text-sm leading-tight cursor-pointer">
                    I agree to receive text messages about Miami real estate opportunities.
                    Message & data rates may apply. Reply STOP to opt out anytime.
                  </Label>
                </div>
              )}
              {form.formState.errors.sms_consent && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sms_consent.message}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Calculating...' : QUIZ_COPY.leadCapture.button}
              </Button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                {QUIZ_COPY.leadCapture.privacyNote} See our{' '}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
