import * as z from 'zod';

// Quiz Answer Types
export type HousingStatus = 'rent' | 'own_condo' | 'own_house' | 'exploring';
export type MonthlyCostBracket = 'under_2k' | '2k_3.5k' | '3.5k_5k' | '5k_7.5k' | '7.5k_10k' | 'over_10k' | 'prefer_not_say';
export type IncomeBracket = 'under_100k' | '100k_150k' | '150k_250k' | '250k_400k' | '400k_750k' | 'over_750k' | 'prefer_not_say';
export type Frustration = 'taxes' | 'cost_of_living' | 'winters' | 'congestion' | 'regulations' | 'space';
export type Benefit = 'no_tax' | 'outdoor_lifestyle' | 'more_space' | 'pro_business' | 'work_life_balance' | 'networking';
export type Timeline = '0-6mo' | '6-12mo' | '1-3y' | 'someday';
export type Concern = 'hurricanes' | 'heat' | 'transit' | 'career_network' | 'industry_remote' | 'schools';
export type Tier = 'tier_a_hot_lead' | 'tier_b_nurture_warm' | 'tier_c_nurture_cold';

// Quiz State
export interface QuizAnswers {
  housing_status?: HousingStatus;
  monthly_cost?: MonthlyCostBracket;
  income_bracket?: IncomeBracket;
  frustration?: Frustration;
  benefit?: Benefit;
  timeline?: Timeline;
  concern?: Concern;
}

export interface SavingsBreakdown {
  tax_savings: number;
  housing_savings: number;
  util_savings: number;
  annual_savings: number;
  ny_tax: number;
  housing_ny: number;
  housing_mia: number;
  util_ny: number;
  util_mia: number;
}

export interface QuizSession {
  session_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
}

// Validation Schemas
export const leadCaptureSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .regex(
      /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Please enter a valid US phone number'
    )
    .optional()
    .or(z.literal('')),
  sms_consent: z.boolean(),
}).refine(
  (data) => !data.phone || data.sms_consent,
  {
    message: 'You must consent to SMS messages if providing a phone number',
    path: ['sms_consent'],
  }
);

export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;

export const quizAnswersSchema = z.object({
  housing_status: z.enum(['rent', 'own_condo', 'own_house', 'exploring']),
  monthly_cost: z.enum(['under_2k', '2k_3.5k', '3.5k_5k', '5k_7.5k', '7.5k_10k', 'over_10k', 'prefer_not_say']),
  income_bracket: z.enum(['under_100k', '100k_150k', '150k_250k', '250k_400k', '400k_750k', 'over_750k', 'prefer_not_say']),
  frustration: z.enum(['taxes', 'cost_of_living', 'winters', 'congestion', 'regulations', 'space']),
  benefit: z.enum(['no_tax', 'outdoor_lifestyle', 'more_space', 'pro_business', 'work_life_balance', 'networking']),
  timeline: z.enum(['0-6mo', '6-12mo', '1-3y', 'someday']),
  concern: z.enum(['hurricanes', 'heat', 'transit', 'career_network', 'industry_remote', 'schools']).optional(),
});
