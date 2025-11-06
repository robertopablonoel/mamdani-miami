import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import { calculateSavings, calculateTier, formatCurrency } from '@/lib/savingsCalculator';
import { QUIZ_COPY } from '@/content/quiz-copy';
import { trackEvent } from '@/lib/analytics';
import { useState, useEffect } from 'react';
import { ExternalLink, Phone } from 'lucide-react';

interface Props {
  answers: QuizAnswers;
  sessionData: QuizSession;
}

export default function ResultsView({ answers, sessionData }: Props) {
  const [savings, setSavings] = useState(() =>
    calculateSavings(answers.income_bracket!, answers.monthly_cost!, answers.age_bracket)
  );

  const tier = calculateTier(answers.timeline!, savings.annual_savings);
  const isTopBracket = answers.income_bracket === 'over_750k';

  // Show booking CTAs to everyone
  const qualifiesForCall = true;

  useEffect(() => {
    trackEvent('result_view', {
      session_id: sessionData.session_id,
      annual_savings: savings.annual_savings,
      retirement_savings: savings.retirement_savings,
      tier,
    });
  }, [sessionData.session_id, savings.annual_savings, savings.retirement_savings, tier]);

  const openCalendly = () => {
    trackEvent('cta_click_book', { session_id: sessionData.session_id });
    window.open(import.meta.env.VITE_CALENDLY_URL, '_blank');
  };

  return (
    <div className="min-h-screen gradient-premium py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">

        {/* Hero Section - Big Reveal */}
        <Card className="shadow-2xl border-0 bg-white overflow-hidden">
          <CardContent className="p-0">
            {/* Header Badge */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🚨</span>
                <span className="font-bold text-lg">STOP Funding Mamdani's Agenda—Here's Your Escape Plan</span>
              </div>
            </div>

            {/* Main Number */}
            <div className="bg-gradient-to-br from-green-50 via-white to-green-50 p-6 md:p-12 text-center border-b-4 border-green-600">
              {savings.retirement_savings > 0 ? (
                <>
                  <h1 className="text-xl md:text-3xl font-serif mb-3 text-red-700">
                    How Much You're SENDING to Mamdani Instead of Building Your Wealth
                  </h1>
                  <div className="text-4xl md:text-8xl font-bold text-green-600 mb-3 tracking-tight break-words">
                    {formatCurrency(savings.retirement_savings)}{isTopBracket ? '+' : ''}
                  </div>
                  <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 px-2">
                    That's <strong className="text-red-700">{formatCurrency(savings.annual_savings)}{isTopBracket ? '+' : ''}/year</strong> you're handing to Mamdani for "progressive programs"—or you could compound it at 7% for <strong className="text-gray-800">{savings.years_until_retirement} years</strong> and keep it for YOUR family
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl md:text-3xl font-serif mb-3 text-red-700">
                    How Much You're SENDING to Mamdani Every Year
                  </h1>
                  <div className="text-4xl md:text-8xl font-bold text-green-600 mb-3 tracking-tight break-words">
                    {formatCurrency(savings.annual_savings)}{isTopBracket ? '+' : ''}
                  </div>
                  <p className="text-lg md:text-2xl text-red-700 font-medium mb-2">
                    Going Straight to Mamdani
                  </p>
                  <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                    That's <strong className="text-red-700">{formatCurrency(Math.floor(savings.annual_savings / 12))}{isTopBracket ? '+' : ''}/month</strong> funding socialism instead of building YOUR wealth
                  </p>
                </>
              )}
            </div>

            {/* Comparison Table */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-red-50 to-orange-50 border-t-4 border-red-600">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
                Your Money: <span className="text-red-600">Funding Mamdani</span> vs. <span className="text-green-600">Building YOUR Wealth</span>
              </h2>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="py-3 px-2 text-left text-sm md:text-base font-bold text-gray-600">Timeline</th>
                      <th className="py-3 px-2 text-center text-sm md:text-base font-bold text-red-600">Stay in NY<br/>(Pay Mamdani)</th>
                      <th className="py-3 px-2 text-center text-sm md:text-base font-bold text-green-600">Move to FL<br/>(Keep It)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-800">Year 1</td>
                      <td className="py-4 px-2 text-center text-red-600 font-mono text-lg md:text-xl font-bold">-{formatCurrency(savings.annual_savings)}{isTopBracket ? '+' : ''}</td>
                      <td className="py-4 px-2 text-center text-green-600 font-mono text-lg md:text-xl font-bold">$0</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-800">10 Years</td>
                      <td className="py-4 px-2 text-center text-red-600 font-mono text-lg md:text-xl font-bold">-{formatCurrency(savings.annual_savings * 10)}{isTopBracket ? '+' : ''}</td>
                      <td className="py-4 px-2 text-center text-green-600 font-mono text-lg md:text-xl font-bold">$0</td>
                    </tr>
                    {savings.retirement_savings > 0 && (
                      <tr className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors">
                        <td className="py-5 px-2 font-bold text-gray-900 text-sm md:text-base">
                          Retirement<br/>
                          <span className="text-xs font-normal text-gray-600">({savings.years_until_retirement}y @ 7%)</span>
                        </td>
                        <td className="py-5 px-2 text-center">
                          <div className="text-red-600 font-mono font-bold text-base md:text-xl">-{formatCurrency(savings.retirement_savings)}{isTopBracket ? '+' : ''}</div>
                          <div className="text-xs text-gray-600 mt-1">Gone to Mamdani</div>
                        </td>
                        <td className="py-5 px-2 text-center">
                          <div className="text-green-600 font-mono font-bold text-base md:text-xl">{formatCurrency(savings.retirement_savings)}{isTopBracket ? '+' : ''}</div>
                          <div className="text-xs text-gray-600 mt-1">YOUR wealth</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {qualifiesForCall && (
                <div className="text-center">
                  <Button size="lg" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-bold px-8" onClick={openCalendly}>
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Stop Funding Mamdani—Book Your Escape Call
                  </Button>
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm mb-2">Or call now for immediate assistance:</p>
                    <a href="tel:+17872431212" className="inline-flex items-center gap-2 text-red-600 font-bold text-lg hover:text-red-700 transition-colors">
                      <Phone className="h-5 w-5" />
                      +1 (787) 243-1212
                    </a>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">Free strategy call • No pressure • Just a plan to keep YOUR money</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTA #1 - Above the Fold */}
        {qualifiesForCall && (
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl">🚀</span>
                </div>
                <h3 className="text-lg md:text-2xl font-serif">Want to see what moving to South Florida could look like?</h3>
              </div>
              <p className="text-red-50 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                Book a free call with our Chief Strategist. We'll show you exactly how to keep YOUR money instead of sending it to Mamdani for "progressive programs."
              </p>
              <Button size="lg" className="w-full bg-white text-red-700 hover:bg-red-50 h-12 md:h-14 text-sm md:text-base font-bold" onClick={openCalendly}>
                <ExternalLink className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Book My Escape Call Now</span>
              </Button>
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm mb-2">Or call now for immediate assistance:</p>
                <a href="tel:+17872431212" className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-white/90 transition-colors">
                  <Phone className="h-5 w-5" />
                  +1 (787) 243-1212
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Upgrades Section */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-3xl font-serif mb-4 md:mb-6 text-gray-800">What You Get When You Stop Funding Mamdani's New York</h2>
            <ul className="space-y-3 md:space-y-4">
              {Object.entries(QUIZ_COPY.lifestyleUpgrades).map(([_, text], idx) => (
                <li key={idx} className="flex items-start gap-2 md:gap-3">
                  <span className="text-green-600 font-bold text-lg md:text-xl flex-shrink-0">✓</span>
                  <span className="flex-1 leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Neighborhoods */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-3xl font-serif mb-3 md:mb-4 text-gray-800">Neighborhoods We Recommend For You</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Based on your income bracket and housing preferences, these Miami neighborhoods match your profile:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {answers.income_bracket && ['250k_400k', '400k_750k', 'over_750k'].includes(answers.income_bracket) ? (
                <>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Coral Gables</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Tree-lined streets, excellent schools, Mediterranean architecture</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Home: $1.2M - $3M+</div>
                      <div>🏫 Top-rated schools</div>
                      <div>🌳 Family-friendly</div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Coconut Grove</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Waterfront living, bohemian vibe, upscale dining</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Home: $900K - $2.5M</div>
                      <div>🌊 Waterfront access</div>
                      <div>🍷 Art & culture hub</div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Brickell</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Urban luxury, walkable, Miami's financial district</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Condo: $600K - $2M</div>
                      <div>🏙️ High-rise living</div>
                      <div>🚶 Walkable nightlife</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Pinecrest</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Suburban feel, great schools, family-oriented</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Home: $600K - $1.2M</div>
                      <div>🏫 A+ rated schools</div>
                      <div>👨‍👩‍👧‍👦 Parks & recreation</div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Aventura</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Shopping, beaches, modern condos</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Condo: $400K - $800K</div>
                      <div>🛍️ Aventura Mall nearby</div>
                      <div>🏖️ Beach access</div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Wynwood</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Art district, trendy, young professional vibe</p>
                    <div className="text-xs space-y-1">
                      <div>💰 Avg Condo: $350K - $600K</div>
                      <div>🎨 Art & culture</div>
                      <div>🍻 Breweries & cafes</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-3xl font-serif mb-4 md:mb-6 text-center text-gray-800">
              Join Thousands Who've Made the Move
            </h2>
            <div className="space-y-4 md:space-y-6">
              {QUIZ_COPY.testimonials.map((testimonial, idx) => (
                <blockquote key={idx} className="border-l-4 border-primary pl-4 md:pl-6 py-2 italic text-sm md:text-lg">
                  "{testimonial.quote}"
                  <footer className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3 not-italic font-medium">
                    — {testimonial.author}, <span className="text-primary">{testimonial.location}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA #3 - After Testimonials */}
        {qualifiesForCall && (
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-red-700 to-red-900 text-white overflow-hidden">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg md:text-2xl font-serif">Protect Your Wealth From Mamdani's Tax Grab</h3>
              </div>
              <p className="text-red-50 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                Join the exodus—hundreds of high earners have already escaped to South Florida. Book your free call and start reclaiming what's YOURS.
              </p>
              <Button size="lg" className="w-full bg-white text-red-700 hover:bg-red-50 h-12 md:h-14 text-sm md:text-base font-bold" onClick={openCalendly}>
                <ExternalLink className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="truncate">Escape Mamdani's NY—Book Call</span>
              </Button>
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm mb-2">Or call now for immediate assistance:</p>
                <a href="tel:+17872431212" className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-white/90 transition-colors">
                  <Phone className="h-5 w-5" />
                  +1 (787) 243-1212
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
