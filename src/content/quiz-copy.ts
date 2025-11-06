import type { Frustration, Benefit, Concern } from '@/types/quiz';

export const QUIZ_COPY = {
  screens: [
    {
      step: 1,
      goal: 'Grab them emotionally from word one',
      h1: "First, let's talk about the pain...",
      subhead: 'Be honest. What REALLY drives you crazy? (Select all that apply)',
      question: 'What pisses you off about living in New York?',
      multiSelect: true,
      options: [
        { value: 'taxes', label: '💸 Paying $30K+/year in state taxes for... what exactly?' },
        { value: 'cost_of_living', label: '💰 Spending $5,000/month to live in a shoebox' },
        { value: 'winters', label: '❄️ Brutal winters where you can\'t go outside 4 months/year' },
        { value: 'congestion', label: '🚇 Commutes that steal 2 hours of your day' },
        { value: 'regulations', label: '📜 Regulations & red tape strangling your business' },
        { value: 'space', label: '🏠 Having ZERO outdoor space (no yard, no garage, nothing)' },
      ],
      button: 'Next',
    },
    {
      step: 2,
      goal: 'Quantify housing burden',
      h1: "Now let's quantify the bleeding...",
      subhead: 'Include rent or mortgage + HOA/co-op fees. Rough estimate is fine.',
      question: 'What\'s your monthly housing cost?',
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
      h1: "Next: Let's calculate how much NY is stealing from you every year...",
      subhead: 'Your answer is 100% confidential and helps us show you your exact tax savings.',
      question: 'What\'s your approximate annual household income?',
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
      goal: 'Identify housing situation',
      h1: "Quick one: What's your current housing situation?",
      subhead: 'This helps us compare apples to apples with Miami options.',
      question: 'Are you renting or owning in the New York area?',
      options: [
        { value: 'rent', label: '🏢 Renting an apartment' },
        { value: 'own_condo', label: '🏘️ Owning a condo or co-op' },
        { value: 'own_house', label: '🏡 Owning a house' },
        { value: 'exploring', label: '🔍 Exploring a purchase soon' },
      ],
      button: 'Next',
    },
    {
      step: 5,
      goal: 'Identify aspirational motivation',
      h1: 'Forget the pain for a second. What does your DREAM LIFE in Miami look like?',
      subhead: 'Choose what excites you. (Select all that apply)',
      question: 'Your ideal Miami scenario:',
      multiSelect: true,
      options: [
        { value: 'no_tax', label: '☀️ No state income tax = $40K+/year back in my pocket' },
        { value: 'outdoor_lifestyle', label: '🌴 Beach, golf, outdoor life 12 months/year' },
        { value: 'more_space', label: '🏡 A REAL house with a yard and garage' },
        { value: 'pro_business', label: '💼 Business-friendly state that rewards success' },
        { value: 'work_life_balance', label: '🏖️ Work from paradise (laptop + rooftop infinity pool)' },
        { value: 'networking', label: '🤝 Networking with other high-performers who escaped' },
      ],
      button: 'Next',
    },
    {
      step: 6,
      goal: 'Qualify buying intent & urgency',
      h1: 'When are you ready to stop overpaying?',
      subhead: "No commitment—just helps us prioritize your results.",
      question: 'Your realistic timeline:',
      options: [
        { value: '0-6mo', label: '🚀 ASAP (next 6 months)' },
        { value: '6-12mo', label: '📅 Soon (6-12 months)' },
        { value: '1-3y', label: '🗓️ Planning ahead (1-3 years)' },
        { value: 'someday', label: '🤔 Just exploring (but curious)' },
      ],
      button: 'Show Me The Numbers',
    },
  ],

  teaserResults: {
    h1: 'Based on Your Answers...',
    savingsRange: {
      prefix: 'Your Estimated Annual Savings:',
      suffix: '/year',
    },
    bullets: [
      "That's money BACK IN YOUR POCKET every year.",
      "What could you do with an extra {amount}?",
    ],
    uses: [
      '→ Max out retirement accounts',
      '→ Pay off your mortgage 10 years early',
      '→ Upgrade to a 3BR pool house',
      '→ Actually take those vacations you\'ve been putting off',
      '→ Build real wealth instead of funding Albany',
    ],
  },

  leadCapture: {
    h1: 'Want Your EXACT Breakdown + Neighborhood Matches?',
    subhead: 'Enter your email to get your full personalized report.',
    benefits: [
      'Your dollar-for-dollar savings breakdown',
      'Miami neighborhoods that match your budget & lifestyle',
      'Your #1 concern (addressed with data & case studies)',
      'BONUS: "The Miami Insider Guide" (PDF, $97 value)',
    ],
    privacyNote: '🔒 Zero spam. We respect your inbox. Unsubscribe anytime.',
    urgency: '⏰ Only 7 consultation slots left this week for high-priority relocators',
    button: 'Show Me My Full Report',
    takeaway: 'IMPORTANT: This calculator is only for NYC-area residents earning $150K+ household income. If that\'s not you, please don\'t submit.',
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

  neighborhoods: [
    { slug: 'brickell', label: '🏙️ Brickell', description: 'Finance Hub' },
    { slug: 'wynwood', label: '🎨 Wynwood', description: 'Arts & Culture' },
    { slug: 'edgewater', label: '🌊 Edgewater', description: 'Waterfront Living' },
    { slug: 'coral-gables', label: '🌳 Coral Gables', description: 'Family-Friendly' },
    { slug: 'coconut-grove', label: '🥥 Coconut Grove', description: 'Bohemian Village' },
  ],
};
