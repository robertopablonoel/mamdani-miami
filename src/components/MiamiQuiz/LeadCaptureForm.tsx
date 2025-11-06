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
import { calculateSavings, formatCurrency } from '@/lib/savingsCalculator';
import { trackEvent } from '@/lib/analytics';
import { QUIZ_COPY } from '@/content/quiz-copy';
import { CheckCircle } from 'lucide-react';

interface Props {
  answers: QuizAnswers;
  sessionData: QuizSession;
  onSubmit: () => void;
}

export default function LeadCaptureForm({ answers, sessionData, onSubmit }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate savings for teaser
  const savings = calculateSavings(
    answers.income_bracket!,
    answers.monthly_cost!
  );

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

  // Calculate savings range (conservative estimate ±15%)
  const savingsLow = Math.floor(savings.annual_savings * 0.85);
  const savingsHigh = Math.ceil(savings.annual_savings * 1.15);
  const savingsMid = Math.floor((savingsLow + savingsHigh) / 2);

  return (
    <div className="min-h-screen gradient-premium flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* TEASER RESULTS - Show First */}
        <Card className="shadow-premium border-0 bg-white mb-8">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-2xl md:text-3xl font-serif text-center mb-6">
              {QUIZ_COPY.teaserResults.h1}
            </h1>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-6 text-center">
              <p className="text-sm text-green-700 font-medium uppercase tracking-wide mb-2">
                {QUIZ_COPY.teaserResults.savingsRange.prefix}
              </p>
              <div className="text-4xl md:text-6xl font-serif font-bold text-green-700 mb-2">
                ${savingsLow.toLocaleString()} - ${savingsHigh.toLocaleString()}
              </div>
              <p className="text-lg text-green-700 font-medium">
                {QUIZ_COPY.teaserResults.savingsRange.suffix}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-lg text-center font-medium">
                That's ${savingsMid.toLocaleString()} BACK IN YOUR POCKET every year.
              </p>
              <p className="text-lg text-center text-muted-foreground">
                What could you do with an extra ${savingsMid.toLocaleString()}/year?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-2 text-base text-muted-foreground">
              {QUIZ_COPY.teaserResults.uses.map((use, idx) => (
                <div key={idx}>{use}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NOW THE ASK - Lead Capture Form */}
        <Card className="shadow-premium border-0 bg-white">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3 text-center">
              {QUIZ_COPY.leadCapture.h1}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 text-center">
              {QUIZ_COPY.leadCapture.subhead}
            </p>

            {/* Benefits List */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="font-semibold mb-3 text-foreground">You'll get:</p>
              <div className="space-y-2">
                {QUIZ_COPY.leadCapture.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  placeholder="your.email@example.com"
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
                  For priority access to our Miami brokerage partner (callbacks within 24hrs)
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

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Calculating...' : QUIZ_COPY.leadCapture.button}
              </Button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                {QUIZ_COPY.leadCapture.privacyNote}
              </p>

              {/* Urgency */}
              <div className="text-center pt-2">
                <p className="text-sm text-orange-600 font-medium">
                  {QUIZ_COPY.leadCapture.urgency}
                </p>
              </div>

              {/* Takeaway Close */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  {QUIZ_COPY.leadCapture.takeaway}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
