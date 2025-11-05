-- Add status column to contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied'));

-- Add status column to lead_submissions
ALTER TABLE public.lead_submissions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied'));

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_status ON public.lead_submissions(status);

-- Update RLS policies to allow admins to update status
CREATE POLICY "Admins can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lead submissions" 
ON public.lead_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));