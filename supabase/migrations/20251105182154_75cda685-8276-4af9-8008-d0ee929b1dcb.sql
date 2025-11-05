-- Create a table to track form submission rate limits
CREATE TABLE public.form_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'lead')),
  ip_address TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient rate limit queries
CREATE INDEX idx_form_rate_limits_email_type ON public.form_rate_limits(email, form_type, submitted_at DESC);
CREATE INDEX idx_form_rate_limits_cleanup ON public.form_rate_limits(submitted_at);

-- Enable RLS
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit logs
CREATE POLICY "Admins can view rate limit logs"
ON public.form_rate_limits
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow the service role to insert rate limit records (edge functions will use this)
CREATE POLICY "Service role can insert rate limits"
ON public.form_rate_limits
FOR INSERT
TO service_role
WITH CHECK (true);

-- Function to cleanup old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.form_rate_limits
  WHERE submitted_at < now() - interval '24 hours';
END;
$$;