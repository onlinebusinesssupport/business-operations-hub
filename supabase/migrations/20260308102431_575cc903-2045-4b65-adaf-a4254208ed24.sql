
-- Enable realtime for pods, workflow_stages, signed_documents
ALTER PUBLICATION supabase_realtime ADD TABLE public.pods;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_stages;

-- Add RLS policy for clients to INSERT their own pods
CREATE POLICY "Clients can insert own pods" ON public.pods FOR INSERT
  WITH CHECK (client_id = get_my_client_id());
