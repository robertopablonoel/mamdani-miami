import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const QuizCTA = () => {
  const handleClick = () => {
    trackEvent('cta_click', {
      category: 'engagement',
      label: 'miami_quiz_homepage',
    });
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 gradient-premium relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-premium border-0 overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12 lg:p-16">
              <div className="w-20 md:w-24 h-20 md:h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-glow">
                <Calculator className="w-10 md:w-12 h-10 md:h-12 text-primary" />
              </div>

              <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-4 px-2 text-center">
                Should You Move to Miami?
              </h2>

              <p className="text-lg sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-6 max-w-2xl mx-auto px-4 text-center">
                Take our 60-second quiz to see exactly how much you'd save by leaving New York for Miami—personalized to your income, housing, and lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <Link to="/move-to-miami" onClick={handleClick}>
                  <Button
                    size="lg"
                    className="gradient-gold w-full sm:w-auto h-14 md:h-14 text-base md:text-lg font-medium touch-manipulation shadow-glow hover:shadow-lg transition-shadow"
                  >
                    Calculate My Savings
                    <ArrowRight className="ml-2 w-5 md:w-5 h-5 md:h-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>No state income tax</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Lower cost of living</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Year-round sunshine</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center mt-6 px-4">
                Join 15,000+ New Yorkers who made the move in 2024
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuizCTA;
