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
    answers.monthly_cost!,
    answers.age_bracket
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
      const payload = {
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
          retirement_savings: savings.retirement_savings,
          years_until_retirement: savings.years_until_retirement,
        },
      };

      console.log('Submitting quiz with payload:', payload);

      const { data: result, error } = await supabase.functions.invoke('submit-quiz', {
        body: payload,
      });

      if (error) {
        console.error('Supabase function invocation error:', error);
        throw error;
      }

      if (result?.error) {
        console.error('Function returned error:', result);
        toast({
          title: 'Submission Error',
          description: result.error + (result.details ? `\n\n${result.details}` : ''),
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

  // Determine if we should show "+" for top income bracket
  const isTopBracket = answers.income_bracket === 'over_2m';

  // Use retirement savings as the main number (more impactful)
  const mainSavingsNumber = savings.retirement_savings > 0
    ? savings.retirement_savings
    : savings.annual_savings;

  return (
    <div className="min-h-screen gradient-premium py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* BLURRED REPORT PREVIEW WITH FORM OVERLAY */}
        <div className="relative">

          {/* Blurred Report Preview in Background */}
          <div className="absolute inset-0 pointer-events-none">
            <Card className="shadow-premium border-0 bg-white overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {/* Fake Report Header */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    ✓ Your Personalized Miami Report
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif mb-2 blur-sm">
                    {savings.retirement_savings > 0 ? (
                      <>
                        Total Wealth Increase by Retirement<br />
                        <span className="text-green-600 text-5xl">
                          ${Math.floor(mainSavingsNumber).toLocaleString()}{isTopBracket ? '+' : ''}
                        </span>
                      </>
                    ) : (
                      <>
                        You Could Save<br />
                        <span className="text-green-600 text-5xl">
                          ${Math.floor(mainSavingsNumber).toLocaleString()}{isTopBracket ? '+' : ''}
                        </span><br />
                        Per Year
                      </>
                    )}
                  </h1>
                </div>

                {/* Fake Savings Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6 blur-sm">
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-muted-foreground mb-1">Annual</div>
                    <div className="text-lg font-serif text-green-600">
                      ${Math.floor(savings.annual_savings).toLocaleString()}{isTopBracket ? '+' : ''}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-muted-foreground mb-1">In 10 Years</div>
                    <div className="text-lg font-serif text-green-600">
                      ${Math.floor(savings.annual_savings * 10).toLocaleString()}{isTopBracket ? '+' : ''}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-muted-foreground mb-1">
                      {savings.years_until_retirement > 0 ? `At Retirement (${savings.years_until_retirement}y)` : 'In 30 Years'}
                    </div>
                    <div className="text-lg font-serif text-green-600">
                      ${Math.floor(savings.retirement_savings > 0 ? savings.retirement_savings : savings.annual_savings * 30).toLocaleString()}{isTopBracket ? '+' : ''}
                    </div>
                  </div>
                </div>

                {/* Fake Breakdown Table */}
                <div className="blur-md">
                  <h2 className="text-xl font-serif mb-4">Savings Breakdown</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span>State Income Tax</span>
                      <span className="text-green-600 font-bold">
                        +${Math.floor(savings.tax_savings).toLocaleString()}{isTopBracket ? '+' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded">
                      <span>Housing (Annual)</span>
                      <span className="text-green-600 font-bold">
                        +${Math.floor(savings.housing_savings).toLocaleString()}{isTopBracket ? '+' : ''}
                      </span>
                    </div>
                    {savings.retirement_savings > 0 && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Invested Until Retirement</span>
                        <span className="text-green-600 font-bold">
                          ${Math.floor(savings.retirement_savings).toLocaleString()}{isTopBracket ? '+' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fake Neighborhoods Section */}
                <div className="mt-6 blur-lg">
                  <h2 className="text-xl font-serif mb-3">Your Recommended Neighborhoods</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border rounded p-3">
                      <div className="font-bold mb-1">Coral Gables</div>
                      <div className="text-xs">$1.2M - $3M+</div>
                    </div>
                    <div className="border rounded p-3">
                      <div className="font-bold mb-1">Brickell</div>
                      <div className="text-xs">$600K - $2M</div>
                    </div>
                    <div className="border rounded p-3">
                      <div className="font-bold mb-1">Coconut Grove</div>
                      <div className="text-xs">$900K - $2.5M</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Overlay - Positioned over bottom half */}
          <div className="relative pt-64 md:pt-80">
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-6 md:p-8">

                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full mb-4">
                    <span className="text-lg font-bold">🔒 Enter Your Info to Unlock Full Report</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get your exact savings breakdown + neighborhood recommendations
                  </p>
                </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    className="mt-1 h-12"
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
                    className="mt-1 h-12"
                    {...form.register('email')}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1 h-12"
                  {...form.register('phone')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For priority consultation callbacks within 24 hours
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
                  <Label htmlFor="sms_consent" className="text-xs leading-tight cursor-pointer">
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

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold mt-6" disabled={isSubmitting}>
                {isSubmitting ? 'Generating Your Report...' : 'Get My Full Breakdown →'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {QUIZ_COPY.leadCapture.privacyNote}
              </p>

              {/* Social Proof + Urgency */}
              <div className="text-center pt-2">
                <p className="text-sm font-medium text-foreground">
                  🔥 2,847 NYC professionals got their breakdown this month
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
    </div>
  );
}
