
-- Add first_login flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_login boolean NOT NULL DEFAULT true;

-- Create onboarding_templates table
CREATE TABLE public.onboarding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  brand_name text DEFAULT 'THE BUSINESS SUPPORT STUDIO™',
  va_mode boolean NOT NULL DEFAULT false,
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to onboarding_templates"
  ON public.onboarding_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can read onboarding_templates"
  ON public.onboarding_templates FOR SELECT TO authenticated
  USING (true);
