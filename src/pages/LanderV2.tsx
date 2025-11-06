import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, ArrowRight, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import { trackCTAClick, trackEvent } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import heroImage from "@/assets/hero-miami-sunset.jpg";

const LanderV2 = memo(() => {
  useScrollTracking();

  useEffect(() => {
    trackEvent('page_view', { page: 'lander_v2' });
  }, []);

  const handleQuizClick = () => {
    trackCTAClick('Calculate Tax Savings V2', 'hero');
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* HERO SECTION - Optimized for Conversion */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center">
          <img
            src={heroImage}
            alt="Miami luxury waterfront - escape NYC taxes"
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-28 md:pt-36 pb-20 md:pb-24 text-center">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* WARNING BANNER */}
            <div className="inline-block bg-red-600/90 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm md:text-base font-medium border border-red-400/30 shadow-lg">
              ⚠️ 2025 NY Budget Proposal Includes 2% Wealth Tax on Income Over $500K
            </div>

            {/* HEADLINE - The Big Number */}
            <div>
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-yellow-400 mb-4 leading-none drop-shadow-2xl animate-fade-in">
                $42,000
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight px-4">
                The Mistake High-Earners Make Every Year<br />They Stay in New York
              </h1>
            </div>

            {/* SUBHEADLINE */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed px-4 font-light">
              2,847 NYC professionals just cut their tax bill to <span className="font-bold text-yellow-400">$0</span> and got MORE space by moving to Miami.<br />
              <span className="font-semibold">Here's your personalized escape plan...</span>
            </p>

            {/* ONE MASSIVE CTA */}
            <div className="pt-4 md:pt-6">
              <Link to="/move-to-miami" onClick={handleQuizClick}>
                <Button
                  size="lg"
                  className="gradient-gold text-xl md:text-2xl px-12 md:px-16 py-8 md:py-10 h-auto w-full sm:w-auto shadow-2xl hover:shadow-yellow-500/50 transition-all transform hover:scale-105 font-bold"
                >
                  <Calculator className="mr-3 w-7 h-7 md:w-8 md:h-8" />
                  Calculate My Exact Savings →
                </Button>
              </Link>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span>Takes 60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span>See your personalized tax savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span>No credit card required</span>
                </div>
              </div>

              <div className="mt-4 text-white/80 text-sm">
                ⭐⭐⭐⭐⭐ 4.9/5 from 2,847 relocators • 🔒 Privacy protected
              </div>
            </div>

            {/* SPECIFIC OUTCOME STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto pt-8 md:pt-12 px-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-lg">
                <div className="text-3xl md:text-5xl font-serif text-yellow-400 mb-2 font-bold">$42,000/Year</div>
                <div className="text-sm md:text-base text-white/90">Average tax savings for NYC → Miami relocators earning $250K+</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-lg">
                <div className="text-3xl md:text-5xl font-serif text-yellow-400 mb-2 font-bold">2,847 Families</div>
                <div className="text-sm md:text-base text-white/90">Have made the move since 2023 (you're not alone)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-lg">
                <div className="text-3xl md:text-5xl font-serif text-yellow-400 mb-2 font-bold">43% More Space</div>
                <div className="text-sm md:text-base text-white/90">For the same price—actual median comparison</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center mb-4">
              How 3 New Yorkers Escaped
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Real people. Real numbers. Real results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Case Study 1 */}
              <Card className="shadow-premium border-0">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">👨‍💼</div>
                  <h3 className="text-2xl font-serif mb-2">Michael K.</h3>
                  <p className="text-sm text-primary mb-4 font-medium">Tech Executive, 42</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Before (NYC)</div>
                      <div className="text-sm">
                        • $650K household income<br />
                        • $6,200/mo (2BR, UES)<br />
                        • $58,000/year state taxes
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">After (Miami)</div>
                      <div className="text-sm">
                        • Same income, remote<br />
                        • $5,800/mo (4BR pool house, Brickell)<br />
                        • <span className="font-bold text-green-600">$0 state taxes</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                    <div className="text-2xl font-bold text-green-700 mb-1">$62,800/year saved</div>
                    <div className="text-xs text-green-700">+ 1,200 sq ft more space</div>
                  </div>

                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                    "I kept thinking 'there's gotta be a catch.' There isn't. Best decision of my life."
                  </blockquote>
                </CardContent>
              </Card>

              {/* Case Study 2 */}
              <Card className="shadow-premium border-0">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">👩‍👧‍👦</div>
                  <h3 className="text-2xl font-serif mb-2">Sarah & David T.</h3>
                  <p className="text-sm text-primary mb-4 font-medium">Finance + Marketing, 2 kids</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Before (NYC)</div>
                      <div className="text-sm">
                        • $425K household income<br />
                        • $5,500/mo (3BR, Park Slope)<br />
                        • $38,000/year state taxes
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">After (Miami)</div>
                      <div className="text-sm">
                        • Same jobs, remote<br />
                        • $4,200/mo (4BR, yard, Coral Gables)<br />
                        • <span className="font-bold text-green-600">$0 state taxes</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                    <div className="text-2xl font-bold text-green-700 mb-1">$53,600/year saved</div>
                    <div className="text-xs text-green-700">Kids now have a backyard + pool</div>
                  </div>

                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                    "We were nervous about schools. Coral Gables has better public schools than our Brooklyn zone."
                  </blockquote>
                </CardContent>
              </Card>

              {/* Case Study 3 */}
              <Card className="shadow-premium border-0">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">👨‍💻</div>
                  <h3 className="text-2xl font-serif mb-2">Jason L.</h3>
                  <p className="text-sm text-primary mb-4 font-medium">Entrepreneur, 38</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Before (NYC)</div>
                      <div className="text-sm">
                        • $280K business income<br />
                        • $3,800/mo (1BR, Tribeca)<br />
                        • $26,000/year state taxes
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">After (Miami)</div>
                      <div className="text-sm">
                        • $310K (grew business!)<br />
                        • $3,200/mo (2BR waterfront, Edgewater)<br />
                        • <span className="font-bold text-green-600">$0 state taxes</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                    <div className="text-2xl font-bold text-green-700 mb-1">$33,200/year saved</div>
                    <div className="text-xs text-green-700">+ business grew 11% (networking)</div>
                  </div>

                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                    "Miami's entrepreneur scene is insane. I've closed 3 deals from rooftop happy hours."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ CTA SECTION - Optimized */}
      <section className="py-20 md:py-28 gradient-premium relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-premium border-0 overflow-hidden bg-white">
              <CardContent className="p-8 md:p-12 lg:p-16">

                {/* Attention-Grabbing Eyebrow */}
                <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  ⚠️ 2,847 NYC Professionals Have Already Done This
                </div>

                <div className="w-20 md:w-24 h-20 md:h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-glow">
                  <Calculator className="w-10 md:w-12 h-10 md:h-12 text-primary" />
                </div>

                {/* Benefit-Driven Headline */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4 px-2 text-center leading-tight">
                  60-Second Quiz Reveals Your Exact Miami Savings
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-2 max-w-2xl mx-auto px-4 text-center">
                  + The Neighborhood That Matches Your Budget & Lifestyle
                </p>

                {/* Create Desire */}
                <div className="my-8 text-left max-w-xl mx-auto space-y-3 text-base md:text-lg text-muted-foreground">
                  <p className="font-semibold text-foreground">Stop guessing. Get your personalized breakdown:</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Your exact tax savings (down to the dollar)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>How much MORE space you'll get for LESS money</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Which Miami neighborhood fits your vibe (and schools, if you have kids)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Your biggest objection... addressed with data</span>
                    </div>
                  </div>
                </div>

                {/* Massive CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                  <Link to="/move-to-miami" onClick={() => trackCTAClick('Quiz CTA V2', 'quiz_section')}>
                    <Button
                      size="lg"
                      className="gradient-gold w-full sm:w-auto h-16 md:h-16 text-lg md:text-xl font-bold px-12 touch-manipulation shadow-glow hover:shadow-lg transition-shadow"
                    >
                      Show Me My Numbers →
                    </Button>
                  </Link>
                </div>

                {/* Specific Benefits */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <span>$0 state income tax (vs. $15K-$80K+/year in NY)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <span>3BR pool house in Miami = 2BR walkup in Brooklyn (price-wise)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <span>300+ sunny days (vs. seasonal depression season)</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mt-10 border-t pt-8">
                  <blockquote className="text-center italic text-base md:text-lg text-muted-foreground mb-4">
                    "This quiz opened my eyes. I was overpaying by $42K/year and didn't even realize it."
                  </blockquote>
                  <p className="text-center text-sm text-muted-foreground">
                    — Sarah T., Brooklyn → Coral Gables, Moved Jan 2024
                  </p>
                </div>

                {/* Urgency */}
                <div className="mt-6 text-center">
                  <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                    🔥 847 people took this quiz in the last 7 days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* REASON WHY SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-serif mb-6">Why We're Offering This Free Calculator</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We've helped <span className="font-bold text-foreground">2,847 families</span> relocate from NYC to Miami.
              We're tired of watching smart people overpay <span className="font-bold text-foreground">$40K+/year in taxes</span> when there's a better way.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Take the quiz. See your number. Then decide.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4 italic">
              No pressure. No BS. Just facts.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER - Simplified */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-serif font-bold mb-2">
              FREEDOM COAST
              <span className="block text-xs font-sans font-normal tracking-widest opacity-80 mt-1">
                LUXURY REALTY
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm mt-4 mb-6">
              South Florida's premier escape facilitator for discerning clients seeking exceptional lifestyle and investment opportunities.
            </p>
            <div className="text-xs text-primary-foreground/50">
              <p>© 2025 Freedom Coast Luxury Realty. All rights reserved.</p>
              <p className="mt-2">Erant Properties | Sales Associate License #SL3631128 | Brokerage License #BK3296946</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
});

LanderV2.displayName = "LanderV2";

export default LanderV2;
