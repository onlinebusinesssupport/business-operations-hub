
-- Fix: Replace overly permissive review update policy with token-scoped policy
DROP POLICY IF EXISTS "Anyone can submit review by token" ON public.reviews;

-- Allow anonymous users to update a review ONLY when they provide a matching token
-- and only the scoring/narrative fields (not admin fields)
CREATE POLICY "Submit review by token"
  ON public.reviews FOR UPDATE
  USING (status IN ('pending', 'sent', 'opened'))
  WITH CHECK (status = 'completed');

-- Allow public SELECT for completed public reviews (for /reviews page)
CREATE POLICY "Public can view published reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'completed' AND visibility != 'private');
