
CREATE TABLE public.client_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  sent_by uuid NOT NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text,
  body_text text,
  status text NOT NULL DEFAULT 'sent',
  sent_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.client_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to client_emails"
  ON public.client_emails FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own emails"
  ON public.client_emails FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());
