-- Add updated_at column and trigger for contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add notes and tags for admin management
ALTER TABLE public.contact_submissions
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Create trigger for updated_at on contact_submissions
CREATE OR REPLACE FUNCTION public.update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_contact_submissions_updated_at();

-- Add indexes for common queries on contact_submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_priority ON public.contact_submissions(priority);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

-- Enhance lead_submissions table
ALTER TABLE public.lead_submissions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMP WITH TIME ZONE;

-- Create trigger for updated_at on lead_submissions
CREATE OR REPLACE FUNCTION public.update_lead_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_submissions_updated_at
BEFORE UPDATE ON public.lead_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_submissions_updated_at();

-- Add indexes for common queries on lead_submissions
CREATE INDEX IF NOT EXISTS idx_lead_submissions_created_at ON public.lead_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_status ON public.lead_submissions(status);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_priority ON public.lead_submissions(priority);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_email ON public.lead_submissions(email);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_converted ON public.lead_submissions(converted);