
-- Fix contact_submissions: drop restrictive insert policy, recreate as permissive
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Fix applications: drop restrictive insert policy, recreate as permissive
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applications;
CREATE POLICY "Anyone can submit application"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
