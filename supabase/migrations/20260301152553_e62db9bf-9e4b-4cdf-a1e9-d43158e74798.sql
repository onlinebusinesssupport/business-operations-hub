
-- Reviews table: structured multi-dimension scoring
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  
  -- Executive scoring (1-5)
  score_strategic_clarity smallint CHECK (score_strategic_clarity BETWEEN 1 AND 5),
  score_communication smallint CHECK (score_communication BETWEEN 1 AND 5),
  score_speed smallint CHECK (score_speed BETWEEN 1 AND 5),
  score_commercial_value smallint CHECK (score_commercial_value BETWEEN 1 AND 5),
  score_overall_impact smallint CHECK (score_overall_impact BETWEEN 1 AND 5),
  score_overall smallint CHECK (score_overall BETWEEN 1 AND 5),
  
  -- Value perception
  value_rating text, -- exceptional, good, fair, not_worth
  value_reason text,
  
  -- Impact areas (multi-select)
  impact_areas text[] DEFAULT '{}',
  
  -- NPS (0-10)
  nps_score smallint CHECK (nps_score BETWEEN 0 AND 10),
  nps_recommendation text,
  
  -- Narrative
  biggest_transformation text,
  almost_stopped text,
  improvement_suggestion text,
  one_sentence text,
  
  -- Service context
  services_reviewed text[] DEFAULT '{}',
  engagement_type text DEFAULT 'retainer', -- retainer, side_client, one_off
  
  -- Public permission
  visibility text DEFAULT 'private', -- private, public_anonymous, public_named
  reviewer_name text,
  reviewer_company text,
  reviewer_website text,
  reviewer_photo_url text,
  
  -- Metadata
  work_item_id uuid REFERENCES public.work_items(id),
  submitted_at timestamptz,
  status text NOT NULL DEFAULT 'pending', -- pending, sent, opened, completed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Review requests tracking
CREATE TABLE public.review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  sent_at timestamptz,
  opened_at timestamptz,
  completed_at timestamptz,
  reminder_count smallint DEFAULT 0,
  status text NOT NULL DEFAULT 'draft', -- draft, sent, opened, completed, expired
  created_at timestamptz NOT NULL DEFAULT now()
);

-- CRM extended fields on clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS lead_source text,
  ADD COLUMN IF NOT EXISTS lifecycle_stage text DEFAULT 'onboarding',
  ADD COLUMN IF NOT EXISTS account_owner text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS health_score integer DEFAULT 100,
  ADD COLUMN IF NOT EXISTS lead_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avg_review_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nps_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lifetime_revenue numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS contract_renewal_date date;

-- RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to reviews"
  ON public.reviews FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own completed reviews"
  ON public.reviews FOR SELECT
  USING (client_id = get_my_client_id() AND status = 'completed');

CREATE POLICY "Anyone can submit review by token"
  ON public.reviews FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS for review_requests
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to review_requests"
  ON public.review_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Index for public reviews page
CREATE INDEX idx_reviews_public ON public.reviews (visibility, status, score_overall DESC) WHERE status = 'completed' AND visibility != 'private';
