
-- Service Pods
CREATE TABLE public.pods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'dormant',
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to pods" ON public.pods FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own pods" ON public.pods FOR SELECT
  USING (client_id = get_my_client_id());

CREATE POLICY "Clients can update own pods" ON public.pods FOR UPDATE
  USING (client_id = get_my_client_id())
  WITH CHECK (client_id = get_my_client_id());

-- Workflow Stages
CREATE TABLE public.workflow_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_item_id uuid NOT NULL REFERENCES public.work_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'todo',
  due_date date,
  feedback jsonb DEFAULT '[]'::jsonb,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to workflow_stages" ON public.workflow_stages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own workflow_stages" ON public.workflow_stages FOR SELECT
  USING (work_item_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id()));

-- Signed Documents
CREATE TABLE public.signed_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.work_items(id) ON DELETE CASCADE,
  type text NOT NULL,
  file_path text,
  signed_by_client boolean NOT NULL DEFAULT false,
  signed_by_admin boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  esign_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.signed_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to signed_documents" ON public.signed_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own signed_documents" ON public.signed_documents FOR SELECT
  USING (project_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id()));

CREATE POLICY "Clients can update own signed_documents" ON public.signed_documents FOR UPDATE
  USING (project_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id()))
  WITH CHECK (project_id IN (SELECT id FROM public.work_items WHERE client_id = get_my_client_id()));
