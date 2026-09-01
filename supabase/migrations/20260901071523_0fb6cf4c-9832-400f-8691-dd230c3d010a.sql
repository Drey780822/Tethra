-- Tethra data is only reachable through server functions using the service role.
-- Remove all client-role (anon/authenticated) privileges and make the
-- default-deny posture explicit with restrictive policies.

REVOKE ALL ON public.workspaces FROM anon, authenticated;
REVOKE ALL ON public.projects FROM anon, authenticated;
REVOKE ALL ON public.tasks FROM anon, authenticated;
REVOKE ALL ON public.task_attachments FROM anon, authenticated;

GRANT ALL ON public.workspaces TO service_role;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.tasks TO service_role;
GRANT ALL ON public.task_attachments TO service_role;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct client access to workspaces" ON public.workspaces;
CREATE POLICY "No direct client access to workspaces"
ON public.workspaces AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No direct client access to projects" ON public.projects;
CREATE POLICY "No direct client access to projects"
ON public.projects AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No direct client access to tasks" ON public.tasks;
CREATE POLICY "No direct client access to tasks"
ON public.tasks AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No direct client access to task attachments" ON public.task_attachments;
CREATE POLICY "No direct client access to task attachments"
ON public.task_attachments AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);