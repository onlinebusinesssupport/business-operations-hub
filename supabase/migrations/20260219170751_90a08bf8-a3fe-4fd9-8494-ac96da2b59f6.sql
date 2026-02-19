
-- Add UPDATE policy for clients on their own requests
CREATE POLICY "Clients can update own requests"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (client_id = get_my_client_id() AND submitted_by = auth.uid())
  WITH CHECK (client_id = get_my_client_id() AND submitted_by = auth.uid());

-- Add DELETE policy for clients on their own requests
CREATE POLICY "Clients can delete own requests"
  ON public.requests FOR DELETE
  TO authenticated
  USING (client_id = get_my_client_id() AND submitted_by = auth.uid());
