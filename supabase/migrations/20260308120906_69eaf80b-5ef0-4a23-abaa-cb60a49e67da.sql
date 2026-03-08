
-- Add file columns to invoices table
ALTER TABLE public.invoices ADD COLUMN file_path text;
ALTER TABLE public.invoices ADD COLUMN pop_file_path text;
ALTER TABLE public.invoices ADD COLUMN pop_details jsonb DEFAULT '{}'::jsonb;

-- Allow clients to update their own invoices (for POP upload)
CREATE POLICY "Clients can update own invoices for POP"
ON public.invoices
FOR UPDATE
TO authenticated
USING (client_id = get_my_client_id())
WITH CHECK (client_id = get_my_client_id());

-- Create invoice-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('invoice-files', 'invoice-files', false);

-- Storage RLS: Admins can do everything
CREATE POLICY "Admins full access invoice-files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'invoice-files' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'invoice-files' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: Clients can read their own invoice files
CREATE POLICY "Clients read own invoice files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'invoice-files' 
  AND (storage.foldername(name))[1] = public.get_my_client_id()::text
);

-- Storage RLS: Clients can upload POP files to their folder
CREATE POLICY "Clients upload POP files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'invoice-files' 
  AND (storage.foldername(name))[1] = public.get_my_client_id()::text
  AND (storage.foldername(name))[2] = 'pop'
);
