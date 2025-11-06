import { createClient } from 'supabase';

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
    frustration: string | string[];
    benefit: string | string[];
    timeline: string;
    concern?: string;
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
    console.log('Function invoked, method:', req.method);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const submission: QuizSubmission = await req.json();
    console.log('Parsed submission:', {
      email: submission.email,
      frustration: submission.answers.frustration,
      benefit: submission.answers.benefit,
      fullAnswers: JSON.stringify(submission.answers)
    });

    // Validate required fields
    if (!submission.answers.timeline) {
      throw new Error('Missing required field: timeline');
    }
    if (!submission.answers.income_bracket) {
      throw new Error('Missing required field: income_bracket');
    }
    if (!submission.answers.monthly_cost) {
      throw new Error('Missing required field: monthly_cost');
    }

    // Get client IP (x-forwarded-for can be comma-separated, take first one)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : null;

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
    const insertData = {
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
        ...(Array.isArray(submission.answers.frustration)
          ? submission.answers.frustration.map(f => `frustration_${f}`)
          : submission.answers.frustration ? [`frustration_${submission.answers.frustration}`] : []),
        ...(Array.isArray(submission.answers.benefit)
          ? submission.answers.benefit.map(b => `benefit_${b}`)
          : submission.answers.benefit ? [`benefit_${submission.answers.benefit}`] : []),
      ].filter(Boolean),
    };

    console.log('Inserting quiz lead with data:', JSON.stringify(insertData, null, 2));

    const { error: insertError } = await supabaseAdmin
      .from('quiz_leads')
      .insert([insertData]);

    if (insertError) {
      console.error('Lead insertion error:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      console.error('Error details:', JSON.stringify(insertError, null, 2));

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

      throw new Error(`Database insert failed: ${insertError.message} (code: ${insertError.code})`);
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
    console.error('Error details:', JSON.stringify(error, null, 2));
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Stack trace:', errorStack);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      }),
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
