
CREATE POLICY "Anyone can submit a public review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
