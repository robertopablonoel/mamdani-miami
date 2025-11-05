import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadFormData {
  email: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData: LeadFormData = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';

    console.log('Lead form submission received:', { email: formData.email, ip: clientIP });

    // Rate limiting: Check if this email submitted in the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: recentSubmissions, error: rateLimitError } = await supabaseAdmin
      .from('form_rate_limits')
      .select('id')
      .eq('email', formData.email)
      .eq('form_type', 'lead')
      .gte('submitted_at', twoMinutesAgo);

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      throw new Error('Failed to check rate limit');
    }

    if (recentSubmissions && recentSubmissions.length > 0) {
      console.log('Rate limit exceeded for:', formData.email);
      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please wait 2 minutes before submitting again.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert the lead submission
    const { error: insertError } = await supabaseAdmin
      .from('lead_submissions')
      .insert([{ email: formData.email }]);

    if (insertError) {
      console.error('Lead submission error:', insertError);
      throw insertError;
    }

    // Log the rate limit
    await supabaseAdmin
      .from('form_rate_limits')
      .insert([{
        email: formData.email,
        form_type: 'lead',
        ip_address: clientIP,
      }]);

    console.log('Lead submission successful:', formData.email);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing lead submission:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
