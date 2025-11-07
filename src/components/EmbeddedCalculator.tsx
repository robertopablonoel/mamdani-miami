import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { calculateSavings, formatCurrency } from '@/lib/savingsCalculator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import type { IncomeBracket, MonthlyCostBracket, AgeBracket, QuizAnswers } from '@/types/quiz';
import { v4 as uuidv4 } from 'uuid';

const EmbeddedCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [income, setIncome] = useState<IncomeBracket | ''>('');
  const [housing, setHousing] = useState<MonthlyCostBracket | ''>('');
  const [age, setAge] = useState<AgeBracket | ''>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionData, setSessionData] = useState<{ session_id: string } | null>(null);

  const handleCalculate = async () => {
    if (!income || !housing || !age) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields to see your savings.',
        variant: 'destructive',
      });
      return;
    }

    // Save partial submission (before email capture)
    try {
      const sessionId = uuidv4();

      // Extract UTM params
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source') || undefined;
      const utm_medium = urlParams.get('utm_medium') || undefined;
      const utm_campaign = urlParams.get('utm_campaign') || undefined;
      const utm_content = urlParams.get('utm_content') || undefined;

      const getDeviceType = (): string => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
        return 'desktop';
      };

      const getBrowser = (): string => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
      };

      // Create session and get the ID back
      const { data: sessionRecord, error: sessionError } = await supabase.from('quiz_sessions' as any).insert([{
        session_id: sessionId,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        referrer: document.referrer || undefined,
        device_type: getDeviceType(),
        browser: getBrowser(),
      }]).select('id').single();

      if (sessionError) {
        console.error('Partial session creation error:', sessionError);
      } else if (sessionRecord?.id) {
        console.log('Session created successfully:', sessionId, 'UUID:', sessionRecord.id);

        // Save partial answers
        const { error: answersError } = await supabase.from('quiz_answers' as any).insert([
          {
            session_id: sessionRecord.id,
            step: 1,
            question_key: 'income_bracket',
            answer_value: income,
          },
          {
            session_id: sessionRecord.id,
            step: 2,
            question_key: 'monthly_cost',
            answer_value: housing,
          },
          {
            session_id: sessionRecord.id,
            step: 3,
            question_key: 'age_bracket',
            answer_value: age,
          },
        ]);

        if (answersError) {
          console.error('Error saving partial answers:', answersError);
        } else {
          console.log('Partial answers saved successfully');
        }

        // Store session ID for later use when they submit email
        setSessionData({ session_id: sessionId });
      } else {
        console.error('No session record returned from insert');
      }
    } catch (error) {
      console.error('Error saving partial:', error);
      // Don't block the user if this fails
    }

    trackEvent('calculator_calculate', {
      income,
      housing,
      age,
    });

    setStep('preview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email to see full results.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use existing session if available, otherwise create new one
      const sessionId = sessionData?.session_id || uuidv4();
      const savings = calculateSavings(income as IncomeBracket, housing as MonthlyCostBracket, age as AgeBracket);

      // Only create session if it doesn't exist
      if (!sessionData?.session_id) {
        // Extract UTM params from URL
        const urlParams = new URLSearchParams(window.location.search);
        const utm_source = urlParams.get('utm_source') || undefined;
        const utm_medium = urlParams.get('utm_medium') || undefined;
        const utm_campaign = urlParams.get('utm_campaign') || undefined;
        const utm_content = urlParams.get('utm_content') || undefined;

        // Helper functions
        const getDeviceType = (): string => {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
          if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
          return 'desktop';
        };

        const getBrowser = (): string => {
          const ua = navigator.userAgent;
          if (ua.includes('Chrome')) return 'Chrome';
          if (ua.includes('Safari')) return 'Safari';
          if (ua.includes('Firefox')) return 'Firefox';
          if (ua.includes('Edge')) return 'Edge';
          return 'Other';
        };

        // 1. Create session in quiz_sessions table
        const { error: sessionError } = await supabase.from('quiz_sessions' as any).insert([{
          session_id: sessionId,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          referrer: document.referrer || undefined,
          device_type: getDeviceType(),
          browser: getBrowser(),
        }]);

        if (sessionError) {
          console.error('Session creation error:', sessionError);
          throw sessionError;
        }
      }

      // 2. Submit quiz data
      const { error } = await supabase.functions.invoke('submit-quiz', {
        body: {
          session_id: sessionId,
          first_name: email.split('@')[0], // Use email username as first name
          email,
          phone: phone || null,
          sms_consent: false,
          answers: {
            income_bracket: income,
            monthly_cost: housing,
            age_bracket: age,
            housing_status: 'N/A', // Default
            timeline: '6-12mo', // Default
            frustration: 'N/A', // Default for embedded calculator
            benefit: 'N/A', // Default for embedded calculator
          },
          savings_calculation: {
            annual_savings: savings.annual_savings,
            tax_savings: savings.tax_savings,
            housing_savings: savings.housing_savings,
            retirement_savings: savings.retirement_savings,
            years_until_retirement: savings.years_until_retirement,
          },
        },
      });

      if (error) {
        console.error('Submission error:', error);
        throw error;
      }

      trackEvent('embedded_calculator_submit', {
        session_id: sessionId,
        annual_savings: savings.annual_savings,
      });

      // Navigate to results with data
      navigate('/move-to-miami', {
        state: {
          answers: {
            income_bracket: income,
            monthly_cost: housing,
            age_bracket: age,
            housing_status: 'rent',
            timeline: '6-12mo',
          } as QuizAnswers,
          sessionData: {
            session_id: sessionId,
          },
          fromEmbedded: true,
        },
      });

      // Scroll to top after navigation
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const savings = income && housing && age
    ? calculateSavings(income as IncomeBracket, housing as MonthlyCostBracket, age as AgeBracket)
    : null;

  const isTopBracket = income === 'over_750k';

  return (
    <section id="calculator" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            How Much Are You Losing to NY?
          </h2>
          <p className="text-lg text-gray-600">
            Calculate your savings in 30 seconds
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 md:p-8">
            {step === 'input' ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="income" className="text-base font-semibold mb-2 block">
                    Annual Household Income
                  </Label>
                  <select
                    id="income"
                    value={income}
                    onChange={(e) => setIncome(e.target.value as IncomeBracket)}
                    className="w-full h-12 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select income range</option>
                    <option value="under_100k">Under $100,000</option>
                    <option value="100k_150k">$100,000 – $150,000</option>
                    <option value="150k_250k">$150,000 – $250,000</option>
                    <option value="250k_400k">$250,000 – $400,000</option>
                    <option value="400k_750k">$400,000 – $750,000</option>
                    <option value="over_750k">$750,000+</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="housing" className="text-base font-semibold mb-2 block">
                    Monthly Housing Cost
                  </Label>
                  <select
                    id="housing"
                    value={housing}
                    onChange={(e) => setHousing(e.target.value as MonthlyCostBracket)}
                    className="w-full h-12 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select housing cost</option>
                    <option value="under_2k">Less than $2,000</option>
                    <option value="2k_3.5k">$2,000 – $3,500</option>
                    <option value="3.5k_5k">$3,500 – $5,000</option>
                    <option value="5k_7.5k">$5,000 – $7,500</option>
                    <option value="7.5k_10k">$7,500 – $10,000</option>
                    <option value="over_10k">More than $10,000</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="age" className="text-base font-semibold mb-2 block">
                    Age Range
                  </Label>
                  <select
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value as AgeBracket)}
                    className="w-full h-12 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select age range</option>
                    <option value="under_30">Under 30</option>
                    <option value="30_39">30-39</option>
                    <option value="40_49">40-49</option>
                    <option value="50_59">50-59</option>
                    <option value="60_plus">60+</option>
                  </select>
                </div>

                <Button
                  onClick={handleCalculate}
                  size="lg"
                  className="w-full h-14 text-lg font-bold"
                  disabled={!income || !housing || !age}
                >
                  Calculate My Savings
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Big Result Display */}
                <div className="text-center">
                  <div className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                    ✓ Your Results Are Ready
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif mb-4 text-gray-800">
                    {savings && savings.retirement_savings > 0 ? (
                      <>You Could Build An Extra</>
                    ) : (
                      <>You Could Save</>
                    )}
                  </h3>
                  <div className="text-6xl md:text-7xl font-bold text-green-600 mb-4">
                    {savings && formatCurrency(savings.retirement_savings > 0 ? savings.retirement_savings : savings.annual_savings)}{isTopBracket ? '+' : ''}
                  </div>
                  <p className="text-lg md:text-xl text-gray-600 mb-2">
                    {savings && savings.retirement_savings > 0 ? (
                      <>by moving to South Florida</>
                    ) : (
                      <>per year by moving to South Florida</>
                    )}
                  </p>
                  {savings && savings.retirement_savings > 0 && (
                    <p className="text-sm text-gray-500">
                      That's {formatCurrency(savings.annual_savings)}{isTopBracket ? '+' : ''}/year compounded over {savings.years_until_retirement} years
                    </p>
                  )}
                </div>

                {/* Email Capture Form */}
                <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      See Your Full Breakdown
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tax savings, housing comparison, neighborhoods & free consultation
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-14 text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone (optional)"
                        className="h-14 text-base"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Loading...' : 'Show Full Report →'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
                    >
                      ← Edit my info
                    </button>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EmbeddedCalculator;
