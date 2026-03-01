
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to activity_log"
  ON public.activity_log FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own activity_log"
  ON public.activity_log FOR SELECT TO authenticated
  USING (client_id = get_my_client_id());

CREATE INDEX idx_activity_log_client ON public.activity_log(client_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
