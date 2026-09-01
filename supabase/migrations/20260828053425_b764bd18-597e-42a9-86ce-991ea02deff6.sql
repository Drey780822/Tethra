CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  founder_name text,
  founder_email text,
  email_notifications boolean NOT NULL DEFAULT true,
  default_priority text NOT NULL DEFAULT 'MEDIUM',
  default_timeframe text NOT NULL DEFAULT 'TODAY',
  theme text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  notes text,
  group_label text,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'MEDIUM',
  target_type text NOT NULL DEFAULT 'TODAY',
  due_date date,
  estimated_effort text,
  position integer NOT NULL DEFAULT 0,
  notification_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE public.task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tasks_workspace_idx ON public.tasks(workspace_id, status);
CREATE INDEX projects_workspace_idx ON public.projects(workspace_id);
CREATE INDEX attachments_task_idx ON public.task_attachments(task_id);

GRANT ALL ON public.workspaces TO service_role;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.tasks TO service_role;
GRANT ALL ON public.task_attachments TO service_role;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;