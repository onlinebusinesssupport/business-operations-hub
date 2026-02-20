
-- Applications table for gated access model
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  business_name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL DEFAULT '',
  website text,
  industry text,
  team_size text,
  revenue_range text,
  primary_channel text,
  pain_points text,
  areas_of_support text[] DEFAULT '{}',
  intent text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage applications
CREATE POLICY "Admins full access to applications"
  ON public.applications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert an application (public form)
CREATE POLICY "Anyone can submit application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
