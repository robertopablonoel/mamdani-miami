-- Create analytics table for tracking website visits and user behavior
CREATE TABLE public.page_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser TEXT,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  time_on_page INTEGER, -- seconds spent on page
  scroll_depth INTEGER, -- max scroll percentage reached
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exited_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for common queries
CREATE INDEX idx_page_analytics_session ON public.page_analytics(session_id);
CREATE INDEX idx_page_analytics_created_at ON public.page_analytics(created_at DESC);
CREATE INDEX idx_page_analytics_page_path ON public.page_analytics(page_path);
CREATE INDEX idx_page_analytics_device ON public.page_analytics(device_type);

-- Enable RLS
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Anyone can track page views"
ON public.page_analytics
FOR INSERT
TO anon
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics"
ON public.page_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Function to cleanup old analytics (older than 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.page_analytics
  WHERE created_at < now() - interval '90 days';
END;
$$;