import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import { calculateSavings, calculateTier, formatCurrency } from '@/lib/savingsCalculator';
import { QUIZ_COPY } from '@/content/quiz-copy';
import { trackEvent } from '@/lib/analytics';
import { useState, useEffect } from 'react';
import { ExternalLink, Download } from 'lucide-react';

interface Props {
  answers: QuizAnswers;
  sessionData: QuizSession;
}

export default function ResultsView({ answers, sessionData }: Props) {
  const [savings, setSavings] = useState(() =>
    calculateSavings(answers.income_bracket!, answers.monthly_cost!)
  );

  const tier = calculateTier(answers.timeline!, savings.annual_savings);

  useEffect(() => {
    trackEvent('result_view', {
      session_id: sessionData.session_id,
      annual_savings: savings.annual_savings,
      tier,
    });
  }, [sessionData.session_id, savings.annual_savings, tier]);

  const openCalendly = () => {
    trackEvent('cta_click_book', { session_id: sessionData.session_id });
    window.open(import.meta.env.VITE_CALENDLY_URL, '_blank');
  };

  const downloadGuide = () => {
    trackEvent('cta_click_guide', { session_id: sessionData.session_id });
    // TODO: Implement PDF download
    alert('PDF download coming soon! Check your email for the guide.');
  };

  const getResultsHeading = () => {
    if (savings.annual_savings >= 30000) {
      return `You could save ${formatCurrency(savings.annual_savings)}/year by moving to Miami.`;
    } else if (savings.annual_savings >= 15000) {
      return `You could keep an extra ${formatCurrency(savings.annual_savings)}/year in Miami.`;
    } else {
      return "Here's your personalized Miami comparison.";
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Hero Section */}
        <Card className="shadow-premium border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {getResultsHeading()}
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your responses, here's what your life could look like in Miami.
            </p>
          </CardContent>
        </Card>

        {/* Savings Breakdown Table */}
        <Card className="shadow-premium border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-6">Savings Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2">
                    <th className="py-3 pr-4 font-semibold">Category</th>
                    <th className="py-3 px-2 font-semibold text-right">New York</th>
                    <th className="py-3 px-2 font-semibold text-right">Miami</th>
                    <th className="py-3 pl-2 font-semibold text-right">Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 pr-4">State Income Tax</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(savings.ny_tax)}</td>
                    <td className="py-3 px-2 text-right">$0</td>
                    <td className="py-3 pl-2 text-right font-bold text-green-600">
                      +{formatCurrency(savings.tax_savings)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-4">Housing (Annual)</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(savings.housing_ny)}</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(savings.housing_mia)}</td>
                    <td className="py-3 pl-2 text-right font-bold text-green-600">
                      +{formatCurrency(savings.housing_savings)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-4">Utilities & Other</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(savings.util_ny)}</td>
                    <td className="py-3 px-2 text-right">{formatCurrency(savings.util_mia)}</td>
                    <td className="py-3 pl-2 text-right font-bold text-green-600">
                      +{formatCurrency(savings.util_savings)}
                    </td>
                  </tr>
                  <tr className="font-bold text-lg">
                    <td className="py-4 pr-4">Total Annual Savings</td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 pl-2 text-right text-2xl text-green-600">
                      {formatCurrency(savings.annual_savings)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Assumptions Accordion */}
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="assumptions">
                <AccordionTrigger className="text-sm">View Assumptions & Methodology</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Tax Calculation:</strong> Based on combined NY state + NYC resident effective tax rate for your income bracket vs. FL's $0 state income tax.
                    </p>
                    <p>
                      <strong>Housing:</strong> Miami housing estimated at 25% lower cost than your current NYC payment (conservative baseline).
                    </p>
                    <p>
                      <strong>Utilities:</strong> Estimated 10% lower in Miami (AC costs offset by no heating bills).
                    </p>
                    <p className="text-xs italic mt-4">
                      Note: These are conservative estimates. Actual savings may vary based on specific neighborhoods, lifestyle, and property choices.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Lifestyle Upgrades Section */}
        <Card className="shadow-premium border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-6">What You Gain Beyond the Savings</h2>
            <ul className="space-y-4">
              {answers.benefit && (
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                  <span className="flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: QUIZ_COPY.lifestyleUpgrades[answers.benefit].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              )}
              {answers.frustration === 'winters' && (
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                  <span className="flex-1 leading-relaxed"><strong>Year-round warmth.</strong> Average winter temp: 68°F. No more parkas, no more slush, no more seasonal depression.</span>
                </li>
              )}
              {answers.frustration === 'space' && (
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                  <span className="flex-1 leading-relaxed"><strong>Room to breathe.</strong> Spacious homes with actual yards, garages, and storage. Miami offers 30–40% more space at comparable prices.</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Objection Rebuttal */}
        {answers.concern && answers.concern !== 'none' && (
          <Card className="shadow-premium border-0 bg-blue-50 border-l-4 border-l-blue-500">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif mb-4 text-blue-900">
                Addressing Your Concern: {answers.concern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              <p className="text-base leading-relaxed text-blue-900">
                {QUIZ_COPY.objectionRebuttals[answers.concern]}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Social Proof */}
        <Card className="shadow-premium border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-6 text-center">
              Join Thousands Who've Made the Move
            </h2>
            <div className="space-y-6">
              {QUIZ_COPY.testimonials.map((testimonial, idx) => (
                <blockquote key={idx} className="border-l-4 border-primary pl-6 py-2 italic text-lg">
                  "{testimonial.quote}"
                  <footer className="text-sm text-muted-foreground mt-3 not-italic font-medium">
                    — {testimonial.author}, <span className="text-primary">{testimonial.location}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="space-y-4">
          {(tier === 'tier_a_hot_lead' || tier === 'tier_b_nurture_warm') && (
            <Card className="shadow-premium border-0 gradient-gold">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif mb-2 text-primary">Ready to Explore Miami?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a free consultation with our Miami brokerage partner. No pressure, just answers.
                </p>
                <Button size="lg" className="w-full" onClick={openCalendly}>
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Book Free Miami Relocation Consultation
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-premium border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif mb-2">Get the Miami Insider Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Neighborhood breakdowns, school ratings, and tax strategies—delivered to your inbox.
              </p>
              <Button size="lg" variant="outline" className="w-full" onClick={downloadGuide}>
                <Download className="mr-2 h-5 w-5" />
                Download the Miami Insider Guide (PDF)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Neighborhood Exploration */}
        <Card className="shadow-premium border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-serif mb-4 text-center">Explore Miami Neighborhoods</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {QUIZ_COPY.neighborhoods.map((neighborhood) => (
                <Button
                  key={neighborhood.slug}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    trackEvent('neighborhood_click', { neighborhood: neighborhood.slug });
                    // TODO: Link to neighborhood pages when built
                    alert(`${neighborhood.label} details coming soon!`);
                  }}
                >
                  {neighborhood.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Questions? Ready to make the move?
          </p>
          <Button variant="link" onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
