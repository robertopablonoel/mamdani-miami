import type { MonthlyCostBracket, IncomeBracket, AgeBracket, SavingsBreakdown } from '@/types/quiz';
import calculatorConfig from '@/config/miami-calculator.json';

export function calculateSavings(
  income_bracket: IncomeBracket,
  monthly_cost: MonthlyCostBracket,
  age_bracket?: AgeBracket,
  adjustments?: {
    ny_tax_rate?: number;
    housing_multiplier?: number;
    utilities_delta?: number;
  }
): SavingsBreakdown {
  // Use config or adjustments
  const income = calculatorConfig.income_midpoints[income_bracket];
  const monthly_housing = calculatorConfig.housing_midpoints[monthly_cost];

  const ny_tax_rate = adjustments?.ny_tax_rate ?? calculatorConfig.tax_rates.ny_effective_rates[income_bracket];
  const housing_multiplier = adjustments?.housing_multiplier ?? calculatorConfig.miami_housing_multiplier;
  const utilities_delta = adjustments?.utilities_delta ?? calculatorConfig.utilities_delta_percent;

  // 1. Tax Savings
  const tax_savings = income * ny_tax_rate;

  // 2. Housing Savings
  const housing_ny = monthly_housing * 12;
  const housing_mia = housing_ny * housing_multiplier;
  const housing_savings = Math.max(housing_ny - housing_mia, 0);

  // 3. Utilities Savings
  const util_ny = 3000; // Conservative baseline
  const util_mia = util_ny * (1 + utilities_delta);
  const util_savings = Math.max(util_ny - util_mia, 0);

  // 4. Total
  const annual_savings = tax_savings + housing_savings + util_savings;

  // 5. Retirement Savings (if age provided)
  let retirement_savings = 0;
  let years_until_retirement = 0;

  if (age_bracket) {
    const age = calculatorConfig.age_midpoints[age_bracket];
    const retirement_age = 65;
    years_until_retirement = Math.max(retirement_age - age, 0);

    // Calculate future value of annual savings invested until retirement
    // FV = PMT × [(1 + r)^n - 1] / r
    // Assuming 7% annual return (conservative stock market average)
    const annual_return = 0.07;

    if (years_until_retirement > 0) {
      retirement_savings = annual_savings *
        ((Math.pow(1 + annual_return, years_until_retirement) - 1) / annual_return);
    } else {
      // Already at or past retirement age - just show annual savings
      retirement_savings = annual_savings;
    }
  }

  return {
    tax_savings: Math.round(tax_savings),
    housing_savings: Math.round(housing_savings),
    util_savings: Math.round(util_savings),
    annual_savings: Math.round(annual_savings),
    retirement_savings: Math.round(retirement_savings),
    years_until_retirement,
    ny_tax: Math.round(income * ny_tax_rate),
    housing_ny: Math.round(housing_ny),
    housing_mia: Math.round(housing_mia),
    util_ny: Math.round(util_ny),
    util_mia: Math.round(util_mia),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTier(timeline: string, annual_savings: number): string {
  const timelineScore: Record<string, number> = {
    '0-6mo': 3,
    '6-12mo': 2,
    '1-3y': 1,
    someday: 0,
  };

  const score = timelineScore[timeline] ?? 0;

  if (score >= 2 && annual_savings >= 20000) {
    return 'tier_a_hot_lead';
  } else if (score >= 1 || (annual_savings >= 10000 && annual_savings < 20000)) {
    return 'tier_b_nurture_warm';
  } else {
    return 'tier_c_nurture_cold';
  }
}
