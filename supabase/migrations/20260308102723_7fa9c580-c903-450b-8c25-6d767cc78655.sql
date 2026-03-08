
-- Storage bucket for signed documents
INSERT INTO storage.buckets (id, name, public) VALUES ('signed-documents', 'signed-documents', false);

-- RLS on storage.objects for signed-documents bucket
CREATE POLICY "Admins full access to signed-documents" ON storage.objects FOR ALL
  USING (bucket_id = 'signed-documents' AND (SELECT has_role(auth.uid(), 'admin')));

CREATE POLICY "Clients can view own signed-documents" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'signed-documents'
    AND (storage.foldername(name))[1] = (SELECT get_my_client_id()::text)
  );

CREATE POLICY "Service role can insert signed-documents" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'signed-documents');

-- Enable realtime for signed_documents
ALTER PUBLICATION supabase_realtime ADD TABLE public.signed_documents;
