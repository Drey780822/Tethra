-- TETHRA — Full Database Schema
-- Run in your own Supabase project's SQL editor.

-- ============================================================
-- 1. WORKSPACES — lightweight identity (no auth; token = key)
-- ============================================================
CREATE TABLE public.workspaces (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
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

CREATE UNIQUE INDEX workspaces_token_key ON public.workspaces (token);

GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- All client access flows through server functions with the
-- service role; browser roles get no direct access.
CREATE POLICY "No direct client access to workspaces"
  ON public.workspaces FOR ALL
  TO anon, authenticated
  AS RESTRICTIVE
  USING (false) WITH CHECK (false);

-- ============================================================
-- 2. PROJECTS
-- ============================================================
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX projects_workspace_id_idx ON public.projects (workspace_id);

GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to projects"
  ON public.projects FOR ALL
  TO anon, authenticated
  AS RESTRICTIVE
  USING (false) WITH CHECK (false);

-- ============================================================
-- 3. TASKS
-- ============================================================
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE INDEX tasks_workspace_id_idx ON public.tasks (workspace_id);
CREATE INDEX tasks_project_id_idx ON public.tasks (project_id);
CREATE INDEX tasks_workspace_status_idx ON public.tasks (workspace_id, status);
CREATE INDEX tasks_workspace_target_idx ON public.tasks (workspace_id, target_type);

GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to tasks"
  ON public.tasks FOR ALL
  TO anon, authenticated
  AS RESTRICTIVE
  USING (false) WITH CHECK (false);

-- ============================================================
-- 4. TASK ATTACHMENTS (metadata; files live in Storage)
-- ============================================================
CREATE TABLE public.task_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX task_attachments_task_id_idx ON public.task_attachments (task_id);
CREATE INDEX task_attachments_workspace_id_idx ON public.task_attachments (workspace_id);

GRANT ALL ON public.task_attachments TO service_role;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to task attachments"
  ON public.task_attachments FOR ALL
  TO anon, authenticated
  AS RESTRICTIVE
  USING (false) WITH CHECK (false);

-- ============================================================
-- 5. STORAGE — private bucket for attachments (25 MB limit)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('task-attachments', 'task-attachments', false, 26214400);

-- No RLS policies on storage.objects for anon/authenticated:
-- all uploads/downloads go through server-issued signed URLs
-- after the workspace token is validated.

-- ============================================================
-- Value conventions (enforced in app code, not DB enums)
-- ============================================================
-- priority:       'HIGH' | 'MEDIUM' | 'LOW'
-- target_type:    'TODAY' | 'THIS WEEK' | 'THIS WEEKEND' | 'NEXT WEEK'
--                 | 'THIS MONTH' | 'NEXT MONTH' | 'LATER' | 'BACKLOG'
-- estimated_effort: 'QUICK' | 'HALF DAY' | 'FULL DAY' | 'WEEKEND'
--                 | 'MULTI-WEEK' | 'LONG TERM'
-- status:         'open' | 'done'
-- theme:          'light' | 'dark' | 'system'
-- ============================================================
-- Access model
-- ============================================================
-- Every table has RLS enabled and denies anon/authenticated
-- outright. The app reads/writes only via TanStack server
-- functions that (1) resolve the workspace by its token and
-- (2) use the service-role client. The workspace token is the
-- only credential the browser ever holds.
