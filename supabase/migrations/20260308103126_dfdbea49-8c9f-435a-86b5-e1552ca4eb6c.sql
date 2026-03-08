
-- Stage comments table for inline feedback
CREATE TABLE public.stage_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  work_item_id uuid NOT NULL REFERENCES public.work_items(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL,
  attachment_url text,
  attachment_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stage_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to stage_comments" ON public.stage_comments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own stage_comments" ON public.stage_comments FOR SELECT
  USING (work_item_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id()));

CREATE POLICY "Clients can insert own stage_comments" ON public.stage_comments FOR INSERT
  WITH CHECK (
    work_item_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id())
    AND author_id = auth.uid()
  );

-- Add meeting_url column to workflow_stages
ALTER TABLE public.workflow_stages ADD COLUMN IF NOT EXISTS meeting_url text;

-- Enable realtime for stage_comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.stage_comments;
