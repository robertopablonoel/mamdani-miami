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
CREATE OR REPLACE FUNCTION public.update_quiz_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_leads_updated_at
  BEFORE UPDATE ON public.quiz_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quiz_leads_updated_at();

-- 8. Comment documentation
COMMENT ON TABLE public.quiz_sessions IS 'Tracks each quiz session with UTM attribution';
COMMENT ON TABLE public.quiz_answers IS 'Stores individual question answers per session';
COMMENT ON TABLE public.quiz_leads IS 'Qualified leads from completed quizzes with segmentation';
COMMENT ON VIEW public.vw_quiz_funnel IS 'Funnel analytics: sessions → completions → leads by UTM';
