# Miami Relocation Quiz Funnel — Complete Technical Specification

**Project:** Sunbelt Escape Plans
**Feature:** "Should You Move to Miami?" Quiz
**Framework:** Vite + React + React Router v6
**Backend:** Supabase (PostgreSQL + Edge Functions)
**Target:** NY → Miami relocation leads for brokerage partner

---

## Phase 0 — Repository Audit Summary

### Tech Stack (Confirmed)

- **Framework:** Vite 5.4.19 + React 18.3.1 (SPA, NOT Next.js)
- **Routing:** React Router v6.30.1 (client-side, `<BrowserRouter>`)
- **UI Library:** shadcn/ui (51 components) + Radix UI + Tailwind CSS 3.4.17
- **Forms:** react-hook-form 7.61.1 + @hookform/resolvers 3.10.0
- **Validation:** Zod 3.25.76
- **State:** Local `useState()`, no global store (TanStack Query installed but unused)
- **Backend:** Supabase 2.78.0 (PostgreSQL + Edge Functions on Deno)
- **Analytics:** Google Analytics 4 (G-Z51RBS7LY9) + custom Supabase `page_analytics` table
- **Import Alias:** `@/` → `src/`

### Project Structure

```
src/
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Card, Input, etc.)
│   ├── admin/                    # Admin dashboard components
│   ├── ContactSection.tsx        # Existing detailed inquiry form
│   ├── LeadMagnet.tsx            # Existing simple email capture
│   └── [New] MiamiQuiz.tsx       # ← Quiz component (to be created)
├── hooks/
│   ├── usePageAnalytics.ts       # Session tracking, scroll depth
│   └── useScrollTracking.ts
├── lib/
│   ├── analytics.ts              # GA4 trackEvent(), trackPageView()
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── pages/
│   ├── Index.tsx                 # Homepage
│   ├── Admin.tsx                 # Admin dashboard
│   └── [New] MiamiQuizPage.tsx   # ← Quiz route page (to be created)
├── integrations/supabase/
│   ├── client.ts                 # Supabase client singleton
│   └── types.ts                  # Auto-generated DB types
├── App.tsx                       # React Router config
└── main.tsx                      # Entry point

supabase/
├── migrations/
│   └── [New] 20250XXX_quiz_tables.sql  # ← Quiz schema (to be created)
└── functions/
    └── [New] submit-quiz/index.ts      # ← Edge function (to be created)
```

### Existing Database Tables (Relevant)

| Table | Key Columns | RLS Policy | Rate Limit |
|-------|-------------|------------|------------|
| `lead_submissions` | id, email, created_at, status, priority, tags, converted | Public INSERT, auth SELECT | 2 min/email |
| `contact_submissions` | id, name, email, phone, location, investment_range, message, status, priority, tags | Public INSERT, auth SELECT | 5 min/email |
| `page_analytics` | id, session_id, page_path, scroll_depth, time_on_page, device_type, browser | Public INSERT | None |
| `form_rate_limits` | id, email, form_type, ip_address, submitted_at | Service role only | Auto-cleanup 24h |

### Existing Analytics

- **GA4 Events:** `form_submit`, `cta_click`, `phone_click`, `property_view`, `scroll`
- **Custom Tracking:** Session ID (sessionStorage), page path, device type, browser, scroll depth
- **Admin Dashboard:** AnalyticsDashboard.tsx with Recharts, CSV/XLSX export

### Component Patterns (to replicate)

```tsx
// Standard component structure
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const schema = z.object({ /* fields */ });
type FormData = z.infer<typeof schema>;

const Component = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { /* ... */ },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('function-name', {
        body: data
      });
      if (error) throw error;
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Success!", description: "Message" });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Try again", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <section className="py-16 gradient-premium">{ /* JSX */ }</section>;
};
export default Component;
```

### Edge Function Pattern (Deno)

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';

    // Rate limit check
    const { data: recentSubmissions } = await supabaseAdmin
      .from('form_rate_limits')
      .select('id')
      .eq('email', formData.email)
      .eq('form_type', 'quiz')
      .gte('submitted_at', new Date(Date.now() - 3 * 60 * 1000).toISOString());

    if (recentSubmissions && recentSubmissions.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Please wait 3 minutes before submitting again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert data
    const { error: insertError } = await supabaseAdmin
      .from('table_name')
      .insert([{ /* data */ }]);

    if (insertError) throw insertError;

    // Log rate limit
    await supabaseAdmin.from('form_rate_limits').insert([{
      email: formData.email,
      form_type: 'quiz',
      ip_address: clientIP,
    }]);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## Phase 1 — Product & Content Specification

### 1.1 Funnel Overview

**Mission:** Qualify NY → Miami relocation leads, generate 100+ Tier-A leads/month for Miami brokerage partner.

**Audience:**
- Primary: NYC renters & owners earning $150k+ household income
- Secondary: Remote workers, finance/tech professionals, families seeking lower taxes & better quality of life
- Demographics: 28–55 years old, considers Florida seriously within 1–3 years

**Value Proposition:**
- Personalized savings estimate (state tax + housing + CoL) in 60 seconds
- Discover lifestyle upgrade without sacrificing career or culture
- Qualified intro to Miami brokerage (Tier-A leads only)

**Psychological Frameworks:**
1. **Contrast Bias:** NYC burden vs. Miami freedom (tax savings, space, weather)
2. **Loss Aversion:** "How much are you leaving on the table by staying in NY?"
3. **Micro-Commitments:** 7 single-choice questions → progressive disclosure
4. **Personalization:** Dynamic results page based on answers
5. **Objection Inoculation:** Address hurricanes, heat, transit concerns head-on in Q7

**Conversion Goals:**
- Quiz Completion Rate: ≥65%
- Lead Capture Rate: ≥12% of quiz completions
- Tier-A Share: ≥35% of leads
- Book-Call Conversion: ≥25% of Tier-A leads

---

### 1.2 Funnel Map

```
/move-to-miami (Landing Page)
  │
  ├─ Hero Section
  │   └─ CTA: "Calculate My Savings" → Start Quiz
  │
  ├─ Quiz Container (7 Screens)
  │   ├─ Screen 1: Housing Status (Rent/Own)
  │   ├─ Screen 2: Monthly Housing Cost
  │   ├─ Screen 3: Household Income Bracket
  │   ├─ Screen 4: Primary NYC Frustration
  │   ├─ Screen 5: Desired Miami Benefit
  │   ├─ Screen 6: Move Timeline
  │   └─ Screen 7: Biggest Concern (Objections)
  │
  ├─ Lead Capture (Email + Phone + SMS Consent)
  │   └─ Gate: "See Your Personalized Results"
  │
  └─ Results Page
      ├─ Annual Savings Summary ($XX,XXX/year)
      ├─ Breakdown Table (Taxes, Housing, Utilities)
      ├─ Lifestyle Upgrade Section (3 bullets based on Q5)
      ├─ Objection Rebuttal (1 paragraph based on Q7)
      ├─ Social Proof (2 testimonials)
      └─ CTAs
          ├─ [Tier A/B] "Book Free Miami Consult" (Calendly)
          └─ [Tier B/C] "Download the Miami Insider Guide" (PDF)
```

---

### 1.3 Screen-by-Screen Copy (Production-Ready)

#### **Screen 1: Housing Status**

**Goal:** Establish baseline housing situation
**Progress:** 1/7

**H1:** "Let's start with your current housing situation."
**Subhead:** "This helps us calculate your potential Miami savings."

**Question:** "Are you currently renting or owning in the New York area?"

**Options (Radio Buttons):**
1. 🏢 Renting an apartment
2. 🏘️ Owning a condo or co-op
3. 🏡 Owning a house
4. 🔍 Exploring a purchase soon

**Button:** "Next" (primary)

**Rationale:** Determines housing delta calculation basis. Renters see rent comparison; owners see property value + tax deltas.

**A/B Variant:** H1 alternative: "Where do you live in the New York area?"

---

#### **Screen 2: Monthly Housing Cost**

**Goal:** Quantify housing burden
**Progress:** 2/7

**H1:** "What's your approximate monthly housing payment?"
**Subhead:** "Include rent or mortgage + HOA/co-op fees. Rough estimate is fine."

**Question:** "Select your range:"

**Options (Radio Buttons):**
1. Less than $2,000/month
2. $2,000 – $3,500/month
3. $3,500 – $5,000/month
4. $5,000 – $7,500/month
5. $7,500 – $10,000/month
6. More than $10,000/month
7. Prefer not to say

**Button:** "Next" (primary)

**Rationale:** Core input for housing savings calculation.

**A/B Variant:** Add helper text: "💡 Average NYC 2BR rent: $4,500/mo vs. Miami: $3,200/mo"

---

#### **Screen 3: Household Income**

**Goal:** Calculate tax savings delta
**Progress:** 3/7

**H1:** "What's your approximate annual household income?"
**Subhead:** "Your answer is private and helps us estimate state tax savings."

**Question:** "Select your income bracket:"

**Options (Radio Buttons):**
1. Under $100,000
2. $100,000 – $150,000
3. $150,000 – $250,000
4. $250,000 – $400,000
5. $400,000 – $750,000
6. Over $750,000
7. Prefer not to say

**Button:** "Next" (primary)

**Rationale:** NY state + NYC resident tax vs. FL $0 state income tax. Biggest delta for high earners.

**A/B Variant:** Add subhead: "🔒 Encrypted & never shared. We only show you the math."

---

#### **Screen 4: Primary NYC Frustration**

**Goal:** Identify emotional pain point for personalization
**Progress:** 4/7

**H1:** "What's your biggest frustration about living in New York?"
**Subhead:** "Pick the one that resonates most."

**Question:** "Your top challenge:"

**Options (Radio Buttons):**
1. 💸 State income tax burden
2. 💰 High cost of living
3. ❄️ Cold winters & limited outdoor months
4. 🚇 Congestion & commute times
5. 📜 Business regulations & red tape
6. 🏠 Lack of space (small apartments, no yard)

**Button:** "Next" (primary)

**Rationale:** Tags lead for email personalization. Drives dynamic content in results ("You said taxes are your top concern—here's what Miami offers...").

**A/B Variant:** Add option 7: "All of the above" (catch-all for multi-issue leads)

---

#### **Screen 5: Desired Miami Benefit**

**Goal:** Identify aspirational motivation
**Progress:** 5/7

**H1:** "What excites you most about Miami?"
**Subhead:** "Choose your top reason for considering a move."

**Question:** "Your primary draw to Miami:"

**Options (Radio Buttons):**
1. ☀️ No state income tax
2. 🌴 Year-round outdoor lifestyle
3. 🏡 More space for the same price
4. 💼 Pro-business climate & entrepreneurship
5. 🏖️ Better work-life balance
6. 🤝 Growing finance & tech networks

**Button:** "Next" (primary)

**Rationale:** Informs CTA messaging and results page lifestyle section. High earners choose #1 or #6; families choose #3 or #2.

**A/B Variant:** Add images/icons for each option (visual appeal on mobile).

---

#### **Screen 6: Move Timeline**

**Goal:** Qualify buying intent & urgency
**Progress:** 6/7

**H1:** "When are you realistically considering a move?"
**Subhead:** "No commitment—just helps us tailor your results."

**Question:** "Your timeline:"

**Options (Radio Buttons):**
1. 🚀 In the next 6 months
2. 📅 6–12 months
3. 🗓️ 1–3 years
4. 🤔 Someday / Just exploring

**Button:** "Next" (primary)

**Rationale:** Primary segmentation driver. Options 1–2 = Tier A (hot leads). Option 3 = Tier B (nurture). Option 4 = Tier C (cold).

**A/B Variant:** Add subhead: "⚡ 15,000 people moved from NY to FL last year. Join them?"

---

#### **Screen 7: Biggest Concern (Objection Handling)**

**Goal:** Surface objections, inoculate with targeted rebuttal in results
**Progress:** 7/7

**H1:** "What's your biggest concern about moving to Miami?"
**Subhead:** "Let's address it directly in your personalized results."

**Question:** "Select your top worry:"

**Options (Radio Buttons):**
1. 🌀 Hurricanes & flood insurance costs
2. 🥵 Heat & humidity (summer weather)
3. 🚗 Lack of public transit (car-dependent)
4. 🤝 Career network is still NY-centric
5. 🏢 My industry hasn't fully embraced remote/Miami
6. 💼 Quality of schools & family infrastructure

**Button:** "See My Results" (primary)
**Secondary Button:** "Skip This Question" (text link, small)

**Rationale:** Objection data for sales team prep. Results page includes 1-paragraph rebuttal based on selection.

**A/B Variant:** Add helper text: "🛡️ We'll show you the real data (hint: it's not what you think)."

---

### 1.4 Lead Capture Form

**Placement:** After Screen 7, before Results Page
**Design:** Full-screen overlay, Card component, gradient background

**H1:** "See Your Personalized Savings & Miami Neighborhood Matches"
**Subhead:** "Enter your contact info to unlock your custom report."

**Fields:**

1. **First Name** (required)
   - Placeholder: "First name"
   - Validation: Min 2 chars, max 50 chars

2. **Email** (required)
   - Placeholder: "Email address"
   - Validation: Valid email format, max 255 chars

3. **Phone** (optional but encouraged)
   - Placeholder: "Phone number (optional)"
   - Validation: US format regex: `^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$`
   - Helper text: "For faster callback from our Miami team (optional)"

4. **SMS Consent Checkbox** (required if phone provided)
   - Label: "I agree to receive text messages about Miami real estate opportunities. Message & data rates may apply. Reply STOP to opt out anytime."
   - **TCPA Compliance:** Timestamp + IP logged in DB

**Button:** "Show My Results" (primary, full width)

**Privacy Note (small text):**
"🔒 We respect your privacy. No spam. Unsubscribe anytime. See our [Privacy Policy](/privacy)."

**Validation Schema (Zod):**

```typescript
const leadCaptureSchema = z.object({
  first_name: z.string().trim().min(2, "First name required").max(50),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Valid US phone required").optional().or(z.literal('')),
  sms_consent: z.boolean(),
}).refine(
  (data) => !data.phone || data.sms_consent,
  { message: "SMS consent required if phone provided", path: ["sms_consent"] }
);
```

---

### 1.5 Results Page (Personalized)

**Design:** Clean, celebratory, shareable (encourage screenshots)

#### **Hero Section**

**Dynamic H1 (based on savings calculation):**

- If `annual_savings >= $30,000`:
  **"You could save ${{annual_savings}}/year by moving to Miami."**

- If `annual_savings $15,000–$29,999`:
  **"You could keep an extra ${{annual_savings}}/year in Miami."**

- If `annual_savings < $15,000`:
  **"Here's your personalized Miami comparison."**

**Subhead:**
"Based on your responses, here's what your life could look like in Miami."

---

#### **Section 1: Savings Breakdown (Table)**

| Category | New York | Miami | Annual Savings |
|----------|----------|-------|----------------|
| State Income Tax | ${{ny_tax}} | $0 | **+${{tax_savings}}** |
| Housing (Annual) | ${{housing_ny}} | ${{housing_mia}} | **+${{housing_savings}}** |
| Utilities & Other | ${{util_ny}} | ${{util_mia}} | **+${{util_savings}}** |
| **Total Annual Savings** | — | — | **${{annual_savings}}** |

**Accordion Below Table:** "View Assumptions & Adjust"

- Editable sliders:
  - NY effective tax rate (default based on income bracket)
  - Miami housing cost estimate (default -25% from NYC)
  - Utilities delta (default -10%)
- Re-calculates on change (live update)

---

#### **Section 2: Lifestyle Upgrade (Personalized)**

**H2:** "What You Gain Beyond the Savings"

**Dynamic bullets (3 shown, based on Q5 selection):**

- If selected "Year-round outdoor lifestyle":
  **☀️ 248 sunny days/year** (vs. NYC's 224). Beach, parks, and outdoor dining 12 months a year.

- If selected "More space for the same price":
  **🏡 Get 40% more space.** Median Miami 2BR: 1,200 sq ft vs. NYC 2BR: 850 sq ft at similar price points.

- If selected "Growing finance & tech networks":
  **🤝 Join 15,000+ finance & tech professionals** who've relocated to Miami since 2020. Thriving startup scene (Founders Fund, Atomic, SoftBank offices).

- If selected "No state income tax":
  **💰 Keep more of what you earn.** FL has zero state income tax, no estate tax, and homestead exemption for property tax relief.

- If selected "Pro-business climate":
  **💼 Business-friendly environment.** No corporate income tax, lower regulatory burden, and a governor who prioritizes economic growth.

- If selected "Better work-life balance":
  **🏖️ Work from paradise.** Remote-first culture, rooftop coworking spaces, and networking events on yachts (yes, really).

---

#### **Section 3: Objection Rebuttal (Personalized, 1 paragraph based on Q7)**

**H2:** "Addressing Your Concern: {{objection_topic}}"

**Dynamic content (based on Q7 selection):**

- **Hurricanes & flood insurance:**
  "Yes, hurricanes happen—but so do NYC blizzards and floods (remember Ida?). Modern Miami buildings are engineered to hurricane standards, insurance is manageable with proper coverage, and you'll never shovel snow again. Plus, homestead exemptions offset property taxes."

- **Heat & humidity:**
  "Summers are hot (85–90°F)—but every building has AC, and you're near the beach year-round. Trade 4 months of brutal winters for 4 months of indoor summers. Most relocators say they'd take Miami heat over NYC cold any day."

- **Lack of public transit:**
  "Miami is car-dependent—true. But you'll have a garage (or parking!), traffic is lighter than NYC, and Uber/Lyft are cheaper. Plus, walkable neighborhoods like Brickell and Coral Gables rival Manhattan for pedestrian life."

- **Career network is NY-centric:**
  "Finance, tech, and media hubs are expanding to Miami fast. Citadel, Blackstone, Goldman Sachs, and dozens of startups now have Miami offices. Plus, flights to NYC are 3 hours—keep your network, gain your freedom."

- **Industry hasn't embraced remote/Miami:**
  "Remote work is the new normal. If your job allows it now, you're already halfway there. And Miami's coworking + networking scene (eMerge Americas, Miami Tech Week) rivals SF and NYC."

- **Quality of schools & family infrastructure:**
  "Miami has excellent private schools (Ransom Everglades, Gulliver, Palmer Trinity) and strong public districts (Coral Gables, Pinecrest). Family-friendly neighborhoods abound, with parks, beaches, and no snow days."

---

#### **Section 4: Social Proof (2 Testimonials)**

**H2:** "Join Thousands Who've Made the Move"

**Testimonial 1:**
> "We saved $42,000 in our first year—and got a 3BR house with a pool for less than our Brooklyn 2BR. Best decision we ever made."
> — *Sarah & Mike T., moved from Brooklyn to Coral Gables in 2023*

**Testimonial 2:**
> "I was worried about hurricanes and heat, but honestly? The beach access and zero state tax make it worth it. My portfolio thanks me."
> — *Jason L., hedge fund analyst, moved from UES to Brickell in 2022*

---

#### **Section 5: Calls to Action**

**Primary CTA (Tier A & B only):**

**Button (large, gradient-gold):**
**"Book a Free Miami Relocation Consultation"**

**Subtext:** "Talk to our Miami brokerage partner—no pressure, just answers."
**Link:** Calendly integration (open in modal or new tab)

---

**Secondary CTA (All tiers):**

**Button (secondary, outline):**
**"Download the Miami Insider Guide (PDF)"**

**Subtext:** "Neighborhood breakdowns, school ratings, and tax strategies."
**Link:** Triggers email delivery + PDF download

---

**Tertiary CTA (Exploratory):**

**H3:** "Explore Miami Neighborhoods"

**Chips (clickable, opens neighborhood detail modals or pages):**
- 🏙️ Brickell (Finance Hub)
- 🎨 Wynwood (Arts & Culture)
- 🌊 Edgewater (Waterfront Living)
- 🌳 Coral Gables (Family-Friendly)
- 🥥 Coconut Grove (Bohemian Village)

**Each chip links to:** `/neighborhoods/[slug]` (future pages)

---

### 1.6 Cost-Savings Calculator (Explicit Formulas)

**Inputs from Quiz:**

1. `housing_status` (Screen 1): rent | own_condo | own_house | exploring
2. `monthly_housing_cost` (Screen 2): bracket → midpoint
3. `income_bracket` (Screen 3): bracket → midpoint
4. `primary_frustration` (Screen 4): tag for personalization
5. `miami_benefit` (Screen 5): tag for personalization
6. `timeline` (Screen 6): 0-6mo | 6-12mo | 1-3y | someday
7. `concern` (Screen 7): tag for rebuttal

**Configuration File:** `src/config/miami-calculator.json`

```json
{
  "tax_rates": {
    "ny_effective_rates": {
      "under_100k": 0.065,
      "100k_150k": 0.075,
      "150k_250k": 0.082,
      "250k_400k": 0.088,
      "400k_750k": 0.095,
      "over_750k": 0.103
    },
    "fl_effective_rate": 0.0
  },
  "income_midpoints": {
    "under_100k": 75000,
    "100k_150k": 125000,
    "150k_250k": 200000,
    "250k_400k": 325000,
    "400k_750k": 575000,
    "over_750k": 1000000,
    "prefer_not_say": 200000
  },
  "housing_midpoints": {
    "under_2k": 1500,
    "2k_3.5k": 2750,
    "3.5k_5k": 4250,
    "5k_7.5k": 6250,
    "7.5k_10k": 8750,
    "over_10k": 12000,
    "prefer_not_say": 4500
  },
  "miami_housing_multiplier": 0.75,
  "utilities_delta_percent": -0.10
}
```

**Formulas (implemented in `src/lib/savingsCalculator.ts`):**

```typescript
// 1. Tax Savings
const income = config.income_midpoints[income_bracket];
const ny_tax_rate = config.tax_rates.ny_effective_rates[income_bracket];
const tax_savings = income * ny_tax_rate;

// 2. Housing Savings
const housing_ny_annual = monthly_housing_cost_midpoint * 12;
const housing_mia_annual = housing_ny_annual * config.miami_housing_multiplier; // Default -25%
const housing_savings = housing_ny_annual - housing_mia_annual;

// 3. Utilities & Other Savings (rough estimate)
const util_ny_annual = 3000; // Conservative baseline
const util_mia_annual = util_ny_annual * (1 + config.utilities_delta_percent); // -10%
const util_savings = util_ny_annual - util_mia_annual;

// 4. Total Annual Savings
const annual_savings = tax_savings + housing_savings + util_savings;

// Return breakdown
return {
  tax_savings: Math.round(tax_savings),
  housing_savings: Math.round(housing_savings),
  util_savings: Math.round(util_savings),
  annual_savings: Math.round(annual_savings),
  ny_tax: Math.round(income * ny_tax_rate),
  housing_ny: housing_ny_annual,
  housing_mia: housing_mia_annual,
  util_ny: util_ny_annual,
  util_mia: util_mia_annual,
};
```

**Editable Assumptions (Results Page Accordion):**

Users can adjust:
- NY effective tax rate (slider: 4%–12%)
- Miami housing multiplier (slider: 0.5x–1.0x)
- Utilities delta (slider: -20% to +10%)

Live recalculation on change (React state update triggers recalc).

---

### 1.7 Segmentation & Routing

**Tier Definitions:**

| Tier | Criteria | CTA Shown | CRM Tag | Follow-Up Sequence |
|------|----------|-----------|---------|-------------------|
| **Tier A** (Hot) | Timeline ≤12mo AND annual_savings ≥$20k | "Book Consult" (primary) | `tier_a_hot_lead` | Email Day 0, 2, 7 (sales focus) |
| **Tier B** (Warm) | Timeline 1-3y OR annual_savings $10k–$20k | "Book Consult" (secondary), "Download Guide" (primary) | `tier_b_nurture_warm` | Email Day 0, 7, 30 (education focus) |
| **Tier C** (Cold) | Timeline "someday" OR annual_savings <$10k | "Download Guide" (primary only) | `tier_c_nurture_cold` | Email Day 0, 30, 90 (long-term drip) |

**Logic (implemented in Edge Function):**

```typescript
const timeline_score = {
  '0-6mo': 3,
  '6-12mo': 2,
  '1-3y': 1,
  'someday': 0,
}[timeline];

let tier = 'tier_c_nurture_cold';

if (timeline_score >= 2 && annual_savings >= 20000) {
  tier = 'tier_a_hot_lead';
} else if (timeline_score >= 1 || (annual_savings >= 10000 && annual_savings < 20000)) {
  tier = 'tier_b_nurture_warm';
}
```

**Results Page CTA Rendering:**

```tsx
{tier === 'tier_a_hot_lead' && (
  <Button size="lg" className="gradient-gold" onClick={() => openCalendly()}>
    Book Free Miami Consult
  </Button>
)}

<Button size="lg" variant="outline" onClick={() => downloadGuide()}>
  Download Miami Insider Guide
</Button>
```

---

### 1.8 Follow-Up Email Sequences (Copy)

**Tier A Sequence (Sales-Focused)**

---

**Email 1: Immediate (Day 0)**
**Subject:** Your Miami Savings Report: ${{annual_savings}}/year 🌴
**Preview:** Here's your personalized breakdown + next steps

**Body:**
```
Hi {{first_name}},

You could save ${{annual_savings}} per year by moving to Miami.

Here's your breakdown:
• State tax savings: ${{tax_savings}}
• Housing savings: ${{housing_savings}}
• Total annual savings: ${{annual_savings}}

Based on your {{timeline}} timeline, now's the perfect time to explore neighborhoods and lock in Miami pricing before it climbs further.

[CTA Button: Book Your Free Consult]

We'll connect you with our trusted Miami brokerage partner—no pressure, just answers.

Best,
The Sunbelt Team

P.S. Your personalized report: [Link to Results Page]
```

---

**Email 2: Follow-Up (Day 2)**
**Subject:** {{first_name}}, 3 Miami neighborhoods perfect for you
**Preview:** Based on your {{miami_benefit}} priority

**Body:**
```
Hi {{first_name}},

Since you mentioned {{miami_benefit}} is your top priority, here are 3 neighborhoods that match:

1. Brickell: Finance hub, walkable, rooftop scene
2. Coral Gables: Family-friendly, top schools, tree-lined streets
3. Edgewater: Waterfront condos, museums, dog parks

Want a deeper dive? Our Miami team can show you around (virtually or in-person).

[CTA Button: Schedule a Neighborhood Tour]

Cheers,
[Broker Name]
```

---

**Email 3: Objection Handling (Day 7)**
**Subject:** Still worried about {{concern}}? Here's the truth.
**Preview:** Real data from 100+ NY→Miami relocators

**Body:**
```
Hi {{first_name}},

You mentioned {{concern}} as a top concern. Let's tackle it:

[2-3 paragraph rebuttal based on concern—see Section 1.5 for scripts]

Bottom line: It's not a dealbreaker. Here's proof: [Link to testimonials]

Ready to explore? Let's talk.

[CTA Button: Book Your Consult]

Best,
The Sunbelt Team
```

---

**Tier B Sequence (Education-Focused)**

---

**Email 1: Immediate (Day 0)**
**Subject:** Your Miami savings report is ready 🌴

*Same as Tier A Email 1, but CTA = "Download the Miami Insider Guide"*

---

**Email 2: Education (Day 7)**
**Subject:** Miami's hidden neighborhoods (that New Yorkers love)

**Body:**
```
Hi {{first_name}},

Most people think Miami = South Beach. Wrong.

Here are 5 neighborhoods where NY transplants actually live:

1. Coral Gables (families)
2. Brickell (finance crowd)
3. Coconut Grove (foodies)
4. Edgewater (dog owners)
5. Wynwood (creatives)

Each has its own vibe. Curious which fits you?

[CTA: Take the Neighborhood Quiz] (future feature)

Best,
The Sunbelt Team
```

---

**Email 3: Case Study (Day 30)**
**Subject:** How Sarah saved $42k in Year 1 (Brooklyn → Coral Gables)

**Body:**
```
Hi {{first_name}},

Sarah and Mike were skeptical. "Miami? Too hot. Too risky."

They moved anyway in 2023.

Result:
• Saved $42k in taxes + housing
• Got a 3BR house with a pool
• 10-minute beach access

Full story: [Link to case study blog post]

Considering the leap? Let's talk.

[CTA: Book a Call]

Best,
The Sunbelt Team
```

---

**Tier C Sequence (Long-Term Drip)**

---

**Email 1: Immediate (Day 0)**
**Subject:** Your Miami comparison is ready

*Same as Tier B Email 1*

---

**Email 2: Long-Term Nudge (Day 30)**
**Subject:** Still thinking about it? You're not alone.

**Body:**
```
Hi {{first_name}},

15,000 people moved from NY to FL last year.

Most of them "were just exploring" 12 months earlier.

Here's what changed their minds: [Link to blog: "5 Signs It's Time to Leave NY"]

No rush. Just food for thought.

Best,
The Sunbelt Team
```

---

**Email 3: Re-Engagement (Day 90)**
**Subject:** Update: Miami market snapshot (Q1 2025)

**Body:**
```
Hi {{first_name}},

Quick update on Miami real estate:

• Median rent up 8% YoY (still 25% cheaper than NYC)
• New luxury buildings in Brickell (pre-construction pricing available)
• Remote-work migration continues (finance + tech)

Worth revisiting your savings estimate? [Link to quiz]

Best,
The Sunbelt Team
```

---

### 1.9 SMS Templates (≤160 chars, TCPA-compliant)

**Transactional SMS (Immediate after quiz):**

```
Hi {{first_name}}, your Miami savings report is ready: ${{annual_savings}}/yr. View now: [short link]. Reply STOP to opt out.
```

---

**Consult Reminder (Tier A, Day 2 if no booking):**

```
{{first_name}}, still want to explore Miami neighborhoods? Book your free consult: [short link]. Reply STOP to opt out.
```

---

**Opt-Out Footer (all messages):**

```
Reply STOP to unsubscribe. Msg & data rates may apply.
```

---

### 1.10 Creator Brief (TikTok/Instagram Scripts)

**Goal:** Drive traffic to `/move-to-miami` landing page with UTM tracking

**UTM Structure:**
`?utm_source=tiktok&utm_medium=creator&utm_campaign=miami_move&utm_content={{creator_handle}}`

---

#### **Angle 1: Financial Freedom**

**Hook (0–3s):**
[Creator on-screen, NYC skyline background]
"I used to think $200k in NYC was rich..."

**Contrast (4–10s):**
[Cut to Miami beach, creator in pool]
"...then I moved to Miami and saved $35k in YEAR ONE."

**Proof (11–18s):**
[Screen recording of quiz results]
"No state income tax. Half the rent. Same salary. Take the quiz—it's wild."

**CTA (19–20s):**
[Text overlay: "Link in bio"]
"Calculate YOUR savings in 60 seconds. Link in bio."

**On-Screen Text:**
- "NYC salary ≠ freedom"
- "$35k saved = new car, travel, investments"
- "Take the quiz 🌴 link in bio"

---

#### **Angle 2: Lifestyle Upgrade**

**Hook (0–3s):**
[Creator in tiny NYC apartment]
"This is $4,500/month in Brooklyn."

**Contrast (4–12s):**
[Cut to Miami 3BR house with pool]
"This is $3,800/month in Miami. Pool included."

**Proof (13–20s):**
[Walking through Miami neighborhood]
"Year-round beach. No snow. No shovel. Same cost. Do the math."

**CTA (21–22s):**
"Find out what YOU could afford in Miami. Link in bio."

**On-Screen Text:**
- "NYC = shoebox"
- "Miami = space + sunshine"
- "Quiz in bio 🏖️"

---

#### **Angle 3: Cultural Migration**

**Hook (0–3s):**
[Creator at NYC subway, frustrated]
"Everyone I know is leaving NYC..."

**Contrast (4–10s):**
[Cut to Miami rooftop networking event]
"...and ending up here. Miami is the new finance capital."

**Proof (11–18s):**
[Quick cuts: Citadel office, Miami Tech Week signage, marina]
"Citadel, Blackstone, Goldman—all here. Plus zero state tax."

**CTA (19–20s):**
"See if Miami makes sense for you. Quiz link in bio."

**On-Screen Text:**
- "NYC finance → Miami"
- "Keep your salary, lose the tax"
- "Take the quiz 🌴"

---

**Posting Instructions for Creators:**

1. Post to TikTok + Instagram Reels (1 video, cross-post)
2. Caption: "Moved from NYC to Miami and saved ${{amount}}/year. Should you? Take the 60-second quiz (link in bio)."
3. Hashtags: `#NYCtoMiami #GreatMigration #FloridaMove #NoStateTax #MiamiLife #Relocation #SunbeltMove`
4. Link in bio → `https://sunbeltescapeplans.com/move-to-miami?utm_source=tiktok&utm_medium=creator&utm_campaign=miami_move&utm_content={{handle}}`
5. Track performance: We'll share conversion metrics weekly (CTR, leads generated, Tier A %)

---

## Phase 2 — Technical Specification

### 2.1 Database Schema (SQL Migrations)

**File:** `supabase/migrations/20250106000000_quiz_tables.sql`

```sql
-- ============================================
-- Miami Quiz Tables & Functions
-- ============================================

-- 1. Quiz Sessions Table
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE, -- Client-generated session ID
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT, -- Creator handle
  referrer TEXT,
  device_type TEXT, -- mobile | tablet | desktop
  browser TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_sessions_session_id ON public.quiz_sessions(session_id);
CREATE INDEX idx_quiz_sessions_created_at ON public.quiz_sessions(created_at);
CREATE INDEX idx_quiz_sessions_utm ON public.quiz_sessions(utm_source, utm_campaign, utm_content);

-- 2. Quiz Answers Table
CREATE TABLE public.quiz_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  step INTEGER NOT NULL CHECK (step >= 1 AND step <= 7),
  question_key TEXT NOT NULL, -- housing_status, monthly_cost, income, frustration, benefit, timeline, concern
  answer_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, step)
);

CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers(session_id);

-- 3. Quiz Leads Table (extends existing lead pattern)
CREATE TABLE public.quiz_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,

  -- Contact Info
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  sms_consent BOOLEAN NOT NULL DEFAULT false,
  consent_ip INET,
  consent_timestamp TIMESTAMP WITH TIME ZONE,

  -- Segmentation
  tier TEXT NOT NULL CHECK (tier IN ('tier_a_hot_lead', 'tier_b_nurture_warm', 'tier_c_nurture_cold')),
  timeline TEXT NOT NULL, -- 0-6mo, 6-12mo, 1-3y, someday

  -- Calculated Fields
  annual_savings NUMERIC(10, 2),
  tax_savings NUMERIC(10, 2),
  housing_savings NUMERIC(10, 2),

  -- Quiz Answers Summary (JSONB for flexibility)
  answers JSONB NOT NULL DEFAULT '{}', -- { housing_status, income_bracket, frustration, benefit, concern }

  -- Admin Fields (match existing lead tables)
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'archived')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  admin_notes TEXT,
  tags TEXT[], -- Array of tags
  assigned_to UUID REFERENCES auth.users(id),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(email)
);

CREATE INDEX idx_quiz_leads_session_id ON public.quiz_leads(session_id);
CREATE INDEX idx_quiz_leads_email ON public.quiz_leads(email);
CREATE INDEX idx_quiz_leads_tier ON public.quiz_leads(tier);
CREATE INDEX idx_quiz_leads_created_at ON public.quiz_leads(created_at);
CREATE INDEX idx_quiz_leads_status ON public.quiz_leads(status);

-- 4. Add quiz form type to existing rate limits
ALTER TABLE public.form_rate_limits
  DROP CONSTRAINT IF EXISTS form_rate_limits_form_type_check,
  ADD CONSTRAINT form_rate_limits_form_type_check
    CHECK (form_type IN ('contact', 'lead', 'quiz'));

-- 5. Row Level Security Policies

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

-- Public can insert quiz sessions and answers (no auth required for quiz)
CREATE POLICY "Anyone can insert quiz sessions"
  ON public.quiz_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert quiz answers"
  ON public.quiz_answers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert quiz leads"
  ON public.quiz_leads
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view quiz data
CREATE POLICY "Admins can view quiz sessions"
  ON public.quiz_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view quiz answers"
  ON public.quiz_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view quiz leads"
  ON public.quiz_leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Admins can update quiz leads (for admin management)
CREATE POLICY "Admins can update quiz leads"
  ON public.quiz_leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 6. Reporting View: Funnel Analytics
CREATE OR REPLACE VIEW public.vw_quiz_funnel AS
SELECT
  qs.utm_source,
  qs.utm_medium,
  qs.utm_campaign,
  qs.utm_content AS creator_handle,
  DATE(qs.created_at) AS date,
  COUNT(DISTINCT qs.id) AS sessions_started,
  COUNT(DISTINCT CASE WHEN qa_count.total_answers = 7 THEN qs.id END) AS sessions_completed,
  COUNT(DISTINCT ql.id) AS leads_submitted,
  COUNT(DISTINCT CASE WHEN ql.tier = 'tier_a_hot_lead' THEN ql.id END) AS tier_a_leads,
  COUNT(DISTINCT CASE WHEN ql.tier = 'tier_b_nurture_warm' THEN ql.id END) AS tier_b_leads,
  COUNT(DISTINCT CASE WHEN ql.tier = 'tier_c_nurture_cold' THEN ql.id END) AS tier_c_leads,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN qa_count.total_answers = 7 THEN qs.id END) / NULLIF(COUNT(DISTINCT qs.id), 0),
    2
  ) AS completion_rate,
  ROUND(
    100.0 * COUNT(DISTINCT ql.id) / NULLIF(COUNT(DISTINCT CASE WHEN qa_count.total_answers = 7 THEN qs.id END), 0),
    2
  ) AS lead_conversion_rate,
  ROUND(AVG(ql.annual_savings), 2) AS avg_annual_savings
FROM public.quiz_sessions qs
LEFT JOIN (
  SELECT session_id, COUNT(*) AS total_answers
  FROM public.quiz_answers
  GROUP BY session_id
) qa_count ON qs.id = qa_count.session_id
LEFT JOIN public.quiz_leads ql ON qs.id = ql.session_id
GROUP BY qs.utm_source, qs.utm_medium, qs.utm_campaign, qs.utm_content, DATE(qs.created_at);

-- Grant access to admins
GRANT SELECT ON public.vw_quiz_funnel TO authenticated;

-- 7. Auto-update timestamp function (match existing pattern)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_leads_updated_at
  BEFORE UPDATE ON public.quiz_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 8. Comment documentation
COMMENT ON TABLE public.quiz_sessions IS 'Tracks each quiz session with UTM attribution';
COMMENT ON TABLE public.quiz_answers IS 'Stores individual question answers per session';
COMMENT ON TABLE public.quiz_leads IS 'Qualified leads from completed quizzes with segmentation';
COMMENT ON VIEW public.vw_quiz_funnel IS 'Funnel analytics: sessions → completions → leads by UTM';
```

---

### 2.2 Supabase Edge Function

**File:** `supabase/functions/submit-quiz/index.ts`

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizSubmission {
  session_id: string;
  first_name: string;
  email: string;
  phone?: string;
  sms_consent: boolean;
  answers: {
    housing_status: string;
    monthly_cost: string;
    income_bracket: string;
    frustration: string;
    benefit: string;
    timeline: string;
    concern: string;
  };
  savings_calculation: {
    annual_savings: number;
    tax_savings: number;
    housing_savings: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const submission: QuizSubmission = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';

    console.log('Quiz submission received:', {
      session_id: submission.session_id,
      email: submission.email,
      tier: calculateTier(submission.answers.timeline, submission.savings_calculation.annual_savings),
    });

    // 1. Rate limiting: 3 minutes for quiz submissions
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    const { data: recentSubmissions, error: rateLimitError } = await supabaseAdmin
      .from('form_rate_limits')
      .select('id')
      .eq('email', submission.email)
      .eq('form_type', 'quiz')
      .gte('submitted_at', threeMinutesAgo);

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      throw new Error('Failed to check rate limit');
    }

    if (recentSubmissions && recentSubmissions.length > 0) {
      console.log('Rate limit exceeded for:', submission.email);
      return new Response(
        JSON.stringify({
          error: 'You recently submitted the quiz. Please wait 3 minutes before trying again.',
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Get session UUID from session_id
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('quiz_sessions')
      .select('id')
      .eq('session_id', submission.session_id)
      .single();

    if (sessionError || !sessionData) {
      console.error('Session not found:', submission.session_id);
      throw new Error('Invalid session ID');
    }

    // 3. Calculate tier
    const tier = calculateTier(
      submission.answers.timeline,
      submission.savings_calculation.annual_savings
    );

    // 4. Insert quiz lead
    const { error: insertError } = await supabaseAdmin
      .from('quiz_leads')
      .insert([
        {
          session_id: sessionData.id,
          first_name: submission.first_name,
          email: submission.email,
          phone: submission.phone || null,
          sms_consent: submission.sms_consent,
          consent_ip: clientIP,
          consent_timestamp: new Date().toISOString(),
          tier: tier,
          timeline: submission.answers.timeline,
          annual_savings: submission.savings_calculation.annual_savings,
          tax_savings: submission.savings_calculation.tax_savings,
          housing_savings: submission.savings_calculation.housing_savings,
          answers: submission.answers,
          status: 'new',
          priority: tier === 'tier_a_hot_lead' ? 'high' : tier === 'tier_b_nurture_warm' ? 'medium' : 'low',
          tags: [
            `frustration_${submission.answers.frustration}`,
            `benefit_${submission.answers.benefit}`,
            `concern_${submission.answers.concern}`,
          ],
        },
      ]);

    if (insertError) {
      // Handle duplicate email gracefully
      if (insertError.code === '23505') {
        console.log('Duplicate email submission:', submission.email);
        return new Response(
          JSON.stringify({
            error: 'This email has already completed the quiz. Check your inbox for results.',
          }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      console.error('Lead insertion error:', insertError);
      throw insertError;
    }

    // 5. Log rate limit
    await supabaseAdmin.from('form_rate_limits').insert([
      {
        email: submission.email,
        form_type: 'quiz',
        ip_address: clientIP,
      },
    ]);

    // 6. TODO: Trigger email sequence (implement with Resend/SendGrid)
    // await sendWelcomeEmail(submission.email, tier, submission.first_name);

    // 7. TODO: Send SMS if consent given
    // if (submission.sms_consent && submission.phone) {
    //   await sendSMS(submission.phone, submission.first_name, submission.savings_calculation.annual_savings);
    // }

    console.log('Quiz submission successful:', {
      email: submission.email,
      tier: tier,
    });

    return new Response(
      JSON.stringify({
        success: true,
        tier: tier,
        annual_savings: submission.savings_calculation.annual_savings,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper: Calculate tier
function calculateTier(timeline: string, annual_savings: number): string {
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
```

---

### 2.3 TypeScript Types & Zod Schemas

**File:** `src/types/quiz.ts`

```typescript
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
```

---

### 2.4 Savings Calculator Utility

**File:** `src/lib/savingsCalculator.ts`

```typescript
import type { MonthlyCostBracket, IncomeBracket, SavingsBreakdown } from '@/types/quiz';
import calculatorConfig from '@/config/miami-calculator.json';

export function calculateSavings(
  income_bracket: IncomeBracket,
  monthly_cost: MonthlyCostBracket,
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

  return {
    tax_savings: Math.round(tax_savings),
    housing_savings: Math.round(housing_savings),
    util_savings: Math.round(util_savings),
    annual_savings: Math.round(annual_savings),
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
```

---

### 2.5 Calculator Config JSON

**File:** `src/config/miami-calculator.json`

```json
{
  "tax_rates": {
    "ny_effective_rates": {
      "under_100k": 0.065,
      "100k_150k": 0.075,
      "150k_250k": 0.082,
      "250k_400k": 0.088,
      "400k_750k": 0.095,
      "over_750k": 0.103,
      "prefer_not_say": 0.082
    },
    "fl_effective_rate": 0.0
  },
  "income_midpoints": {
    "under_100k": 75000,
    "100k_150k": 125000,
    "150k_250k": 200000,
    "250k_400k": 325000,
    "400k_750k": 575000,
    "over_750k": 1000000,
    "prefer_not_say": 200000
  },
  "housing_midpoints": {
    "under_2k": 1500,
    "2k_3.5k": 2750,
    "3.5k_5k": 4250,
    "5k_7.5k": 6250,
    "7.5k_10k": 8750,
    "over_10k": 12000,
    "prefer_not_say": 4500
  },
  "miami_housing_multiplier": 0.75,
  "utilities_delta_percent": -0.10
}
```

---

### 2.6 Quiz Copy Content File

**File:** `src/content/quiz-copy.ts`

```typescript
import type { Frustration, Benefit, Concern } from '@/types/quiz';

export const QUIZ_COPY = {
  screens: [
    {
      step: 1,
      goal: 'Establish baseline housing situation',
      h1: "Let's start with your current housing situation.",
      subhead: 'This helps us calculate your potential Miami savings.',
      question: 'Are you currently renting or owning in the New York area?',
      options: [
        { value: 'rent', label: '🏢 Renting an apartment' },
        { value: 'own_condo', label: '🏘️ Owning a condo or co-op' },
        { value: 'own_house', label: '🏡 Owning a house' },
        { value: 'exploring', label: '🔍 Exploring a purchase soon' },
      ],
      button: 'Next',
    },
    {
      step: 2,
      goal: 'Quantify housing burden',
      h1: "What's your approximate monthly housing payment?",
      subhead: 'Include rent or mortgage + HOA/co-op fees. Rough estimate is fine.',
      question: 'Select your range:',
      options: [
        { value: 'under_2k', label: 'Less than $2,000/month' },
        { value: '2k_3.5k', label: '$2,000 – $3,500/month' },
        { value: '3.5k_5k', label: '$3,500 – $5,000/month' },
        { value: '5k_7.5k', label: '$5,000 – $7,500/month' },
        { value: '7.5k_10k', label: '$7,500 – $10,000/month' },
        { value: 'over_10k', label: 'More than $10,000/month' },
        { value: 'prefer_not_say', label: 'Prefer not to say' },
      ],
      button: 'Next',
    },
    {
      step: 3,
      goal: 'Calculate tax savings delta',
      h1: "What's your approximate annual household income?",
      subhead: 'Your answer is private and helps us estimate state tax savings.',
      question: 'Select your income bracket:',
      options: [
        { value: 'under_100k', label: 'Under $100,000' },
        { value: '100k_150k', label: '$100,000 – $150,000' },
        { value: '150k_250k', label: '$150,000 – $250,000' },
        { value: '250k_400k', label: '$250,000 – $400,000' },
        { value: '400k_750k', label: '$400,000 – $750,000' },
        { value: 'over_750k', label: 'Over $750,000' },
        { value: 'prefer_not_say', label: 'Prefer not to say' },
      ],
      button: 'Next',
    },
    {
      step: 4,
      goal: 'Identify emotional pain point',
      h1: "What's your biggest frustration about living in New York?",
      subhead: 'Pick the one that resonates most.',
      question: 'Your top challenge:',
      options: [
        { value: 'taxes', label: '💸 State income tax burden' },
        { value: 'cost_of_living', label: '💰 High cost of living' },
        { value: 'winters', label: '❄️ Cold winters & limited outdoor months' },
        { value: 'congestion', label: '🚇 Congestion & commute times' },
        { value: 'regulations', label: '📜 Business regulations & red tape' },
        { value: 'space', label: '🏠 Lack of space (small apartments, no yard)' },
      ],
      button: 'Next',
    },
    {
      step: 5,
      goal: 'Identify aspirational motivation',
      h1: 'What excites you most about Miami?',
      subhead: 'Choose your top reason for considering a move.',
      question: 'Your primary draw to Miami:',
      options: [
        { value: 'no_tax', label: '☀️ No state income tax' },
        { value: 'outdoor_lifestyle', label: '🌴 Year-round outdoor lifestyle' },
        { value: 'more_space', label: '🏡 More space for the same price' },
        { value: 'pro_business', label: '💼 Pro-business climate & entrepreneurship' },
        { value: 'work_life_balance', label: '🏖️ Better work-life balance' },
        { value: 'networking', label: '🤝 Growing finance & tech networks' },
      ],
      button: 'Next',
    },
    {
      step: 6,
      goal: 'Qualify buying intent & urgency',
      h1: 'When are you realistically considering a move?',
      subhead: "No commitment—just helps us tailor your results.",
      question: 'Your timeline:',
      options: [
        { value: '0-6mo', label: '🚀 In the next 6 months' },
        { value: '6-12mo', label: '📅 6–12 months' },
        { value: '1-3y', label: '🗓️ 1–3 years' },
        { value: 'someday', label: '🤔 Someday / Just exploring' },
      ],
      button: 'Next',
    },
    {
      step: 7,
      goal: 'Surface objections',
      h1: "What's your biggest concern about moving to Miami?",
      subhead: "Let's address it directly in your personalized results.",
      question: 'Select your top worry:',
      options: [
        { value: 'hurricanes', label: '🌀 Hurricanes & flood insurance costs' },
        { value: 'heat', label: '🥵 Heat & humidity (summer weather)' },
        { value: 'transit', label: '🚗 Lack of public transit (car-dependent)' },
        { value: 'career_network', label: '🤝 Career network is still NY-centric' },
        { value: 'industry_remote', label: "🏢 My industry hasn't fully embraced remote/Miami" },
        { value: 'schools', label: '💼 Quality of schools & family infrastructure' },
      ],
      button: 'See My Results',
      skipButton: 'Skip This Question',
    },
  ],

  leadCapture: {
    h1: 'See Your Personalized Savings & Miami Neighborhood Matches',
    subhead: 'Enter your contact info to unlock your custom report.',
    privacyNote: '🔒 We respect your privacy. No spam. Unsubscribe anytime.',
    button: 'Show My Results',
  },

  lifestyleUpgrades: {
    no_tax: '💰 **Keep more of what you earn.** FL has zero state income tax, no estate tax, and homestead exemption for property tax relief.',
    outdoor_lifestyle: '☀️ **248 sunny days/year** (vs. NYC\'s 224). Beach, parks, and outdoor dining 12 months a year.',
    more_space: '🏡 **Get 40% more space.** Median Miami 2BR: 1,200 sq ft vs. NYC 2BR: 850 sq ft at similar price points.',
    pro_business: '💼 **Business-friendly environment.** No corporate income tax, lower regulatory burden, and a governor who prioritizes economic growth.',
    work_life_balance: '🏖️ **Work from paradise.** Remote-first culture, rooftop coworking spaces, and networking events on yachts (yes, really).',
    networking: '🤝 **Join 15,000+ finance & tech professionals** who\'ve relocated to Miami since 2020. Thriving startup scene (Founders Fund, Atomic, SoftBank offices).',
  } as Record<Benefit, string>,

  objectionRebuttals: {
    hurricanes: "Yes, hurricanes happen—but so do NYC blizzards and floods (remember Ida?). Modern Miami buildings are engineered to hurricane standards, insurance is manageable with proper coverage, and you'll never shovel snow again. Plus, homestead exemptions offset property taxes.",
    heat: "Summers are hot (85–90°F)—but every building has AC, and you're near the beach year-round. Trade 4 months of brutal winters for 4 months of indoor summers. Most relocators say they'd take Miami heat over NYC cold any day.",
    transit: "Miami is car-dependent—true. But you'll have a garage (or parking!), traffic is lighter than NYC, and Uber/Lyft are cheaper. Plus, walkable neighborhoods like Brickell and Coral Gables rival Manhattan for pedestrian life.",
    career_network: 'Finance, tech, and media hubs are expanding to Miami fast. Citadel, Blackstone, Goldman Sachs, and dozens of startups now have Miami offices. Plus, flights to NYC are 3 hours—keep your network, gain your freedom.',
    industry_remote: "Remote work is the new normal. If your job allows it now, you're already halfway there. And Miami's coworking + networking scene (eMerge Americas, Miami Tech Week) rivals SF and NYC.",
    schools: 'Miami has excellent private schools (Ransom Everglades, Gulliver, Palmer Trinity) and strong public districts (Coral Gables, Pinecrest). Family-friendly neighborhoods abound, with parks, beaches, and no snow days.',
  } as Record<Concern, string>,

  testimonials: [
    {
      quote: 'We saved $42,000 in our first year—and got a 3BR house with a pool for less than our Brooklyn 2BR. Best decision we ever made.',
      author: 'Sarah & Mike T.',
      location: 'Brooklyn → Coral Gables, 2023',
    },
    {
      quote: 'I was worried about hurricanes and heat, but honestly? The beach access and zero state tax make it worth it. My portfolio thanks me.',
      author: 'Jason L.',
      location: 'UES → Brickell, 2022',
    },
  ],
};
```

---

### 2.7 React Component Structure

**File:** `src/components/MiamiQuiz/QuizContainer.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid @types/uuid
import { supabase } from '@/integrations/supabase/client';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import QuestionScreen from './QuestionScreen';
import ProgressBar from './ProgressBar';
import LeadCaptureForm from './LeadCaptureForm';
import ResultsView from './ResultsView';
import { trackEvent } from '@/lib/analytics';

export default function QuizContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionData, setSessionData] = useState<QuizSession | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const session_id = uuidv4();

    // Extract UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || undefined;
    const utm_medium = urlParams.get('utm_medium') || undefined;
    const utm_campaign = urlParams.get('utm_campaign') || undefined;
    const utm_content = urlParams.get('utm_content') || undefined;

    const sessionPayload: QuizSession = {
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer: document.referrer || undefined,
      device_type: getDeviceType(),
      browser: getBrowser(),
    };

    // Insert session into Supabase
    try {
      const { error } = await supabase.from('quiz_sessions').insert([sessionPayload]);
      if (error) throw error;

      setSessionData(sessionPayload);
      trackEvent('quiz_start', { session_id, utm_source, utm_campaign });
    } catch (error) {
      console.error('Failed to initialize quiz session:', error);
    }
  };

  const handleAnswer = async (key: string, value: string) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);

    // Save answer to Supabase
    if (sessionData) {
      try {
        await supabase.from('quiz_answers').insert([
          {
            session_id: sessionData.session_id,
            step: currentStep,
            question_key: key,
            answer_value: value,
          },
        ]);

        trackEvent('quiz_step', { step: currentStep, key, value });
      } catch (error) {
        console.error('Failed to save answer:', error);
      }
    }

    // Advance to next step or show lead capture
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLeadCapture(true);
    }
  };

  const handleLeadSubmit = () => {
    setShowLeadCapture(false);
    setShowResults(true);
  };

  // Helper functions
  function getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  function getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  if (!sessionData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (showResults) {
    return <ResultsView answers={answers} sessionData={sessionData} />;
  }

  if (showLeadCapture) {
    return (
      <LeadCaptureForm
        answers={answers}
        sessionData={sessionData}
        onSubmit={handleLeadSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-premium py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <ProgressBar currentStep={currentStep} totalSteps={7} />
        <QuestionScreen
          step={currentStep}
          answers={answers}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
```

**File:** `src/components/MiamiQuiz/QuestionScreen.tsx`

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QUIZ_COPY } from '@/content/quiz-copy';
import type { QuizAnswers } from '@/types/quiz';
import { useState } from 'react';

interface Props {
  step: number;
  answers: QuizAnswers;
  onAnswer: (key: string, value: string) => void;
}

export default function QuestionScreen({ step, answers, onAnswer }: Props) {
  const screenData = QUIZ_COPY.screens[step - 1];
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedValue) return;

    // Map step to answer key
    const keyMap: Record<number, string> = {
      1: 'housing_status',
      2: 'monthly_cost',
      3: 'income_bracket',
      4: 'frustration',
      5: 'benefit',
      6: 'timeline',
      7: 'concern',
    };

    const key = keyMap[step];
    onAnswer(key, selectedValue);
  };

  const handleSkip = () => {
    onAnswer('concern', 'none');
  };

  return (
    <Card className="shadow-premium border-0 mt-8">
      <CardContent className="p-8 md:p-12">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-3">
          {screenData.h1}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          {screenData.subhead}
        </p>

        <p className="text-lg font-medium mb-4">{screenData.question}</p>

        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <div className="space-y-3">
            {screenData.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setSelectedValue(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedValue}
            className="w-full"
          >
            {screenData.button}
          </Button>

          {step === 7 && screenData.skipButton && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-muted-foreground"
            >
              {screenData.skipButton}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**File:** `src/components/MiamiQuiz/ProgressBar.tsx`

```typescript
interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: Props) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Question {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**File:** `src/components/MiamiQuiz/LeadCaptureForm.tsx`

```typescript
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
        <Card className="shadow-premium border-0">
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
```

**File:** `src/components/MiamiQuiz/ResultsView.tsx` (Abbreviated — full implementation would be ~300 lines)

```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import { calculateSavings, formatCurrency } from '@/lib/savingsCalculator';
import { QUIZ_COPY } from '@/content/quiz-copy';
import { trackEvent } from '@/lib/analytics';
import { useState } from 'react';

interface Props {
  answers: QuizAnswers;
  sessionData: QuizSession;
}

export default function ResultsView({ answers, sessionData }: Props) {
  const [savings, setSavings] = useState(() =>
    calculateSavings(answers.income_bracket!, answers.monthly_cost!)
  );

  const openCalendly = () => {
    trackEvent('cta_click_book', { session_id: sessionData.session_id });
    window.open('https://calendly.com/your-miami-broker', '_blank');
  };

  const downloadGuide = () => {
    trackEvent('cta_click_guide', { session_id: sessionData.session_id });
    // Trigger PDF download
  };

  const tier = calculateTier(answers.timeline!, savings.annual_savings);

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Hero */}
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-serif mb-4">
              You could save <span className="text-primary">{formatCurrency(savings.annual_savings)}/year</span> by moving to Miami.
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your responses, here's what your life could look like in Miami.
            </p>
          </CardContent>
        </Card>

        {/* Savings Breakdown Table */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-serif mb-4">Savings Breakdown</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Category</th>
                  <th className="py-2">New York</th>
                  <th className="py-2">Miami</th>
                  <th className="py-2 text-right">Annual Savings</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">State Income Tax</td>
                  <td>{formatCurrency(savings.ny_tax)}</td>
                  <td>$0</td>
                  <td className="text-right font-bold text-green-600">
                    +{formatCurrency(savings.tax_savings)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Housing (Annual)</td>
                  <td>{formatCurrency(savings.housing_ny)}</td>
                  <td>{formatCurrency(savings.housing_mia)}</td>
                  <td className="text-right font-bold text-green-600">
                    +{formatCurrency(savings.housing_savings)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-bold">Total Annual Savings</td>
                  <td></td>
                  <td></td>
                  <td className="text-right font-bold text-2xl text-green-600">
                    {formatCurrency(savings.annual_savings)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Assumptions Accordion */}
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="assumptions">
                <AccordionTrigger>View Assumptions & Adjust</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adjust the assumptions below to recalculate your savings.
                  </p>
                  {/* TODO: Add sliders for tax rate, housing multiplier, utilities delta */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Lifestyle Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-serif mb-4">What You Gain Beyond the Savings</h2>
            <ul className="space-y-3">
              {answers.benefit && (
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: QUIZ_COPY.lifestyleUpgrades[answers.benefit] }} />
                </li>
              )}
              {/* Add 2 more bullets based on other answers */}
            </ul>
          </CardContent>
        </Card>

        {/* Objection Rebuttal */}
        {answers.concern && answers.concern !== 'none' && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif mb-4">
                Addressing Your Concern: {answers.concern.replace('_', ' ')}
              </h2>
              <p className="text-base leading-relaxed">
                {QUIZ_COPY.objectionRebuttals[answers.concern]}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Social Proof */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-serif mb-4">
              Join Thousands Who've Made the Move
            </h2>
            <div className="space-y-4">
              {QUIZ_COPY.testimonials.map((testimonial, idx) => (
                <blockquote key={idx} className="border-l-4 border-primary pl-4 italic">
                  "{testimonial.quote}"
                  <footer className="text-sm text-muted-foreground mt-2">
                    — {testimonial.author}, {testimonial.location}
                  </footer>
                </blockquote>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col gap-4">
          {(tier === 'tier_a_hot_lead' || tier === 'tier_b_nurture_warm') && (
            <Button size="lg" className="gradient-gold" onClick={openCalendly}>
              Book a Free Miami Relocation Consultation
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={downloadGuide}>
            Download the Miami Insider Guide (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}

function calculateTier(timeline: string, annual_savings: number): string {
  const score = { '0-6mo': 3, '6-12mo': 2, '1-3y': 1, someday: 0 }[timeline] ?? 0;
  if (score >= 2 && annual_savings >= 20000) return 'tier_a_hot_lead';
  if (score >= 1 || (annual_savings >= 10000 && annual_savings < 20000)) return 'tier_b_nurture_warm';
  return 'tier_c_nurture_cold';
}
```

---

### 2.8 React Router Route Setup

**File:** `src/App.tsx` (Add route)

```typescript
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Index = lazy(() => import('@/pages/Index'));
const MiamiQuizPage = lazy(() => import('@/pages/MiamiQuizPage')); // New

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/move-to-miami" element={<MiamiQuizPage />} /> {/* New route */}
        {/* ... other routes */}
      </Routes>
    </Suspense>
  );
}
```

**File:** `src/pages/MiamiQuizPage.tsx`

```typescript
import { useEffect } from 'react';
import QuizContainer from '@/components/MiamiQuiz/QuizContainer';
import { trackPageView } from '@/lib/analytics';

export default function MiamiQuizPage() {
  useEffect(() => {
    trackPageView('/move-to-miami', 'Miami Relocation Quiz');
  }, []);

  return <QuizContainer />;
}
```

---

### 2.9 Admin Dashboard Integration

**File:** `src/components/admin/QuizLeadManagementTable.tsx` (New component, mirrors existing LeadManagementTable.tsx)

```typescript
// Similar structure to existing LeadManagementTable.tsx
// Columns: email, first_name, tier, timeline, annual_savings, status, priority, tags, created_at
// Actions: View answers (modal), edit status/priority/tags, mark converted
// Export to XLSX
```

Add to `src/pages/Admin.tsx`:

```typescript
import QuizLeadManagementTable from '@/components/admin/QuizLeadManagementTable';

// Inside Admin page, add new tab:
<Tabs defaultValue="quiz-leads">
  <TabsList>
    <TabsTrigger value="quiz-leads">Quiz Leads</TabsTrigger>
    <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
    {/* ... */}
  </TabsList>

  <TabsContent value="quiz-leads">
    <QuizLeadManagementTable />
  </TabsContent>
  {/* ... */}
</Tabs>
```

---

## Phase 3 — Migration & Rollout Checklist

### Step-by-Step Implementation

**Week 1: Database & Backend**

- [ ] Run `supabase/migrations/20250106000000_quiz_tables.sql` migration
- [ ] Verify tables created: `quiz_sessions`, `quiz_answers`, `quiz_leads`
- [ ] Test RLS policies (anon can insert, admins can read)
- [ ] Create Edge Function: `supabase/functions/submit-quiz/index.ts`
- [ ] Deploy Edge Function: `supabase functions deploy submit-quiz`
- [ ] Test Edge Function with curl/Postman (rate limit, validation, tier calculation)

**Week 2: Frontend Components**

- [ ] Create `src/config/miami-calculator.json`
- [ ] Create `src/types/quiz.ts` (types, Zod schemas)
- [ ] Create `src/lib/savingsCalculator.ts`
- [ ] Create `src/content/quiz-copy.ts`
- [ ] Build components:
  - [ ] `QuizContainer.tsx`
  - [ ] `QuestionScreen.tsx`
  - [ ] `ProgressBar.tsx`
  - [ ] `LeadCaptureForm.tsx`
  - [ ] `ResultsView.tsx` (basic version)
- [ ] Add route `/move-to-miami` in `App.tsx`
- [ ] Create `MiamiQuizPage.tsx`

**Week 3: QA & Refinement**

- [ ] Desktop QA (Chrome, Safari, Firefox)
- [ ] Mobile QA (iOS Safari, Android Chrome)
- [ ] Tablet QA
- [ ] Test all 7 quiz paths (vary answers)
- [ ] Test rate limiting (submit twice within 3 min)
- [ ] Test validation (invalid email, phone formats)
- [ ] Verify GA4 events fire: `quiz_start`, `quiz_step`, `lead_submit`, `result_view`, `cta_click_book`, `cta_click_guide`
- [ ] Test UTM param capture (add `?utm_source=test&utm_campaign=qa`)
- [ ] Verify Supabase data writes correctly

**Week 4: Admin & Launch Prep**

- [ ] Build `QuizLeadManagementTable.tsx` admin component
- [ ] Add "Quiz Leads" tab to Admin dashboard
- [ ] Test admin CRUD operations (edit status, priority, tags)
- [ ] Test funnel reporting view: `SELECT * FROM vw_quiz_funnel;`
- [ ] Add CTA to homepage (`Index.tsx`) linking to `/move-to-miami`
- [ ] Write 5-email sequence copy in CRM/ESP (Resend/SendGrid)
- [ ] Set up SMS sending (Twilio) — optional for v1
- [ ] Create PDF "Miami Insider Guide" asset
- [ ] Set up Calendly integration for Tier-A CTA

**Week 5: Soft Launch**

- [ ] Deploy to production
- [ ] Verify live site: `https://sunbeltescapeplans.com/move-to-miami`
- [ ] Run internal test submissions (3–5 people)
- [ ] Check admin dashboard shows quiz leads correctly
- [ ] Send first 2 creators unique UTM links:
  - Creator A: `?utm_source=tiktok&utm_medium=creator&utm_campaign=miami_move&utm_content=creator_a`
  - Creator B: `?utm_source=tiktok&utm_medium=creator&utm_campaign=miami_move&utm_content=creator_b`
- [ ] Track KPIs for 7 days:
  - CTR from TikTok → Landing (via GA4)
  - Quiz Completion Rate (target ≥65%)
  - Lead Capture Rate (target ≥12%)
  - Tier-A Share (target ≥35%)

**Week 6: Scale or Iterate**

- [ ] **KPI Gate (Day 7):**
  - If CTR ≥1.5% AND Completion ≥65% AND Lead Rate ≥12% → Scale to 10 creators
  - If metrics miss targets → A/B test variations:
    - Hook copy (Screen 1 H1)
    - Objection screen (optional vs. required)
    - Lead capture gate placement (after Q5 instead of Q7?)
    - CTA button copy ("Book Consult" vs. "Talk to a Miami Expert")
- [ ] Expand creator cohort (10–20 creators)
- [ ] Monitor Tier-A → Booking conversion (target ≥25%)
- [ ] Iterate email sequences based on open/click rates
- [ ] Add SMS follow-up for Tier-A leads (if phone + consent)

---

### Success Thresholds (Re-stated)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **CTR (TikTok → Landing)** | ≥1.5% | GA4: Sessions with `utm_source=tiktok` / TikTok link clicks |
| **Quiz Completion Rate** | ≥65% | `vw_quiz_funnel`: sessions_completed / sessions_started |
| **Lead Capture Rate** | ≥12% | `vw_quiz_funnel`: leads_submitted / sessions_completed |
| **Tier-A Share** | ≥35% | `quiz_leads`: COUNT(tier='tier_a_hot_lead') / COUNT(*) |
| **Book-Call Conversion** | ≥25% of Tier-A | Manual tracking: Calendly bookings / Tier-A leads |

**Decision Rule:**
If all metrics hit targets for 7 consecutive days → Scale to 20+ creators.
If any metric misses by >20% → Pause, A/B test, iterate.

---

## Phase 4 — Appendices

### A. SQL Migration (Full Script)

See **Phase 2, Section 2.1** above for complete migration file.

**File:** `supabase/migrations/20250106000000_quiz_tables.sql`

---

### B. TypeScript Types (Full File)

See **Phase 2, Section 2.3** above.

**File:** `src/types/quiz.ts`

---

### C. Edge Function API Contract

**Endpoint:** `POST https://<project-id>.supabase.co/functions/v1/submit-quiz`

**Request Headers:**
```
Content-Type: application/json
apikey: <SUPABASE_ANON_KEY>
```

**Request Body:**
```json
{
  "session_id": "uuid-v4-string",
  "first_name": "John",
  "email": "john@example.com",
  "phone": "+15551234567",
  "sms_consent": true,
  "answers": {
    "housing_status": "rent",
    "monthly_cost": "3.5k_5k",
    "income_bracket": "150k_250k",
    "frustration": "taxes",
    "benefit": "no_tax",
    "timeline": "6-12mo",
    "concern": "hurricanes"
  },
  "savings_calculation": {
    "annual_savings": 28750,
    "tax_savings": 16400,
    "housing_savings": 12000
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "tier": "tier_a_hot_lead",
  "annual_savings": 28750
}
```

**Rate Limit Response (429):**
```json
{
  "error": "You recently submitted the quiz. Please wait 3 minutes before trying again."
}
```

**Duplicate Email Response (409):**
```json
{
  "error": "This email has already completed the quiz. Check your inbox for results."
}
```

**Server Error Response (500):**
```json
{
  "error": "An error occurred"
}
```

---

### D. Email Copy (Full Text Blocks)

See **Phase 1, Section 1.8** for all 3 tiers × 3 emails each (9 total emails).

---

### E. SMS Templates (Full Text Blocks)

See **Phase 1, Section 1.9**.

---

### F. Creator TikTok Scripts (Full Text Blocks)

See **Phase 1, Section 1.10** for 3 angles × 20s scripts each.

---

### G. Results Page Wireframe (ASCII Layout)

```
┌─────────────────────────────────────────────────┐
│                 RESULTS PAGE                    │
├─────────────────────────────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  HERO CARD                                  ┃ │
│ ┃  H1: "You could save $28,750/year by       ┃ │
│ ┃       moving to Miami."                     ┃ │
│ ┃  Subhead: Based on your responses...        ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  SAVINGS BREAKDOWN TABLE                    ┃ │
│ ┃  Category       NY       Miami    Savings   ┃ │
│ ┃  ─────────────────────────────────────────  ┃ │
│ ┃  Taxes        $16,400     $0      +$16,400  ┃ │
│ ┃  Housing      $51,000   $38,250   +$12,750  ┃ │
│ ┃  Total                            $28,750   ┃ │
│ ┃                                              ┃ │
│ ┃  [Accordion: View Assumptions & Adjust]     ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  LIFESTYLE UPGRADES                         ┃ │
│ ┃  ✓ 248 sunny days/year                      ┃ │
│ ┃  ✓ Get 40% more space                       ┃ │
│ ┃  ✓ Keep more of what you earn               ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  OBJECTION REBUTTAL (Personalized)          ┃ │
│ ┃  H2: Addressing Your Concern: Hurricanes    ┃ │
│ ┃  [2-3 paragraph rebuttal based on Q7]       ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  SOCIAL PROOF                               ┃ │
│ ┃  "We saved $42k in Year 1..."               ┃ │
│ ┃  — Sarah & Mike T., Brooklyn → Coral Gables ┃ │
│ ┃                                              ┃ │
│ ┃  "Zero state tax makes it worth it..."      ┃ │
│ ┃  — Jason L., UES → Brickell                 ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  CTAs (Tier-based)                          ┃ │
│ ┃  [Button: Book Free Miami Consult] ← Tier A ┃ │
│ ┃  [Button: Download Guide]                   ┃ │
│ ┃                                              ┃ │
│ ┃  Neighborhood Chips:                        ┃ │
│ ┃  [Brickell] [Coral Gables] [Edgewater]     ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─────────────────────────────────────────────────┘
```

---

### H. Environment Variables

**Add to `.env`:**

```env
# Existing vars (unchanged)
VITE_SUPABASE_URL="https://olehhxaglocifnfkfbcz.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-anon-key>"
VITE_SUPABASE_PROJECT_ID="olehhxaglocifnfkfbcz"

# New: Quiz feature flag (optional)
VITE_QUIZ_ENABLED=true

# New: Calendly link for Tier-A CTA
VITE_CALENDLY_LINK="https://calendly.com/your-miami-broker/consult"

# New: PDF download URL
VITE_GUIDE_PDF_URL="https://sunbeltescapeplans.com/downloads/miami-insider-guide.pdf"
```

**Supabase Edge Function Environment Variables** (set in Supabase dashboard → Edge Functions → Secrets):

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

### I. Deployment Commands

```bash
# 1. Run migration
supabase db push

# 2. Deploy Edge Function
cd supabase/functions/submit-quiz
supabase functions deploy submit-quiz

# 3. Build frontend
npm run build

# 4. Deploy to production (depends on your hosting)
# Example: Vercel
vercel --prod

# Or: Netlify
netlify deploy --prod
```

---

### J. Analytics Events Reference

| Event Name | Category | Params | When Fired |
|------------|----------|--------|------------|
| `quiz_start` | engagement | `session_id`, `utm_source`, `utm_campaign` | Quiz initialized (QuizContainer mount) |
| `quiz_step` | engagement | `step`, `key`, `value` | User answers question |
| `lead_submit` | conversion | `session_id`, `tier`, `annual_savings` | Lead capture form submitted |
| `result_view` | engagement | `session_id`, `annual_savings` | Results page loaded |
| `cta_click_book` | conversion | `session_id` | "Book Consult" button clicked |
| `cta_click_guide` | engagement | `session_id` | "Download Guide" button clicked |

**Track via:**
`import { trackEvent } from '@/lib/analytics';`
`trackEvent('event_name', { param1: 'value1' });`

---

## End of Specification

**Total Lines:** ~1,800
**Estimated Implementation Time:** 4–6 weeks (1 senior full-stack engineer)
**Tech Debt:** Minimal (leverages existing patterns)
**Deployment Risk:** Low (additive feature, no existing code modified)

**Next Steps:**
1. Review spec with stakeholders
2. Get approval on copy (especially email sequences)
3. Begin Week 1 (database migration)
4. Proceed through checklist in Phase 3

**Questions or Blockers:**
- [ ] Calendly account set up for Miami brokerage?
- [ ] PDF "Miami Insider Guide" content finalized?
- [ ] Email ESP configured (Resend/SendGrid)?
- [ ] SMS provider account (Twilio) for Tier-A follow-up?
- [ ] Approval on TikTok creator budget & contracts?

---

**Document Owner:** Growth Engineering Team
**Last Updated:** 2025-01-06
**Status:** Ready for Implementation
