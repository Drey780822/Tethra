import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { stripUndefined } from "./strip-undefined";
import type { Attachment, BoardData, Project, Task } from "./tethra-types";

export const createWorkspace = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ name: z.string().trim().min(1).max(80), email: z.string().trim().email() })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ token: string; workspace: BoardData["workspace"] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("workspaces")
      .insert({ name: data.name, email: data.email })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    const { token, ...workspace } = row as BoardData["workspace"] & { token: string };
    return { token, workspace };
  });

export const getBoard = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<BoardData> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const [projects, tasks] = await Promise.all([
      supabaseAdmin
        .from("projects")
        .select("*")
        .eq("workspace_id", ws.id)
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("tasks")
        .select("*")
        .eq("workspace_id", ws.id)
        .order("created_at", { ascending: false }),
    ]);
    if (projects.error) throw new Error(projects.error.message);
    if (tasks.error) throw new Error(tasks.error.message);
    const { token, ...workspace } = ws;
    void token;
    return {
      workspace,
      projects: (projects.data ?? []) as Project[],
      tasks: (tasks.data ?? []) as Task[],
    };
  });

export const createTasks = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        projectId: z.string().uuid().nullable().optional(),
        tasks: z
          .array(
            z.object({
              title: z.string().trim().min(1).max(300),
              description: z.string().max(4000).nullable().optional(),
              notes: z.string().max(4000).nullable().optional(),
              group_label: z.string().max(120).nullable().optional(),
              priority: z.string().max(20).optional(),
              target_type: z.string().max(20).optional(),
              due_date: z.string().nullable().optional(),
              estimated_effort: z.string().max(20).nullable().optional(),
            }),
          )
          .min(1)
          .max(300),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<Task[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const rows = data.tasks.map((t) => ({
      workspace_id: ws.id,
      project_id: data.projectId ?? null,
      title: t.title,
      description: t.description ?? null,
      notes: t.notes ?? null,
      group_label: t.group_label ?? null,
      priority: t.priority ?? ws.default_priority,
      target_type: t.target_type ?? ws.default_timeframe,
      due_date: t.due_date || null,
      estimated_effort: t.estimated_effort ?? null,
    }));
    const { data: inserted, error } = await supabaseAdmin.from("tasks").insert(rows).select("*");
    if (error) throw new Error(error.message);
    return (inserted ?? []) as Task[];
  });

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        id: z.string().uuid(),
        patch: z.object({
          title: z.string().trim().min(1).max(300).optional(),
          description: z.string().max(4000).nullable().optional(),
          notes: z.string().max(4000).nullable().optional(),
          priority: z.string().max(20).optional(),
          target_type: z.string().max(20).optional(),
          due_date: z.string().nullable().optional(),
          estimated_effort: z.string().max(20).nullable().optional(),
          project_id: z.string().uuid().nullable().optional(),
          group_label: z.string().max(120).nullable().optional(),
        }),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<Task> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const patch = { ...data.patch };
    if (patch.due_date === "") patch.due_date = null;
    const { data: row, error } = await supabaseAdmin
      .from("tasks")
      .update(stripUndefined(patch))
      .eq("id", data.id)
      .eq("workspace_id", ws.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as Task;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().uuid(), id: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { data: files } = await supabaseAdmin
      .from("task_attachments")
      .select("file_path")
      .eq("task_id", data.id)
      .eq("workspace_id", ws.id);
    if (files?.length) {
      await supabaseAdmin.storage.from("task-attachments").remove(files.map((f) => f.file_path));
    }
    const { error } = await supabaseAdmin
      .from("tasks")
      .delete()
      .eq("id", data.id)
      .eq("workspace_id", ws.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setTaskCompletion = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ token: z.string().uuid(), id: z.string().uuid(), completed: z.boolean() }).parse(data),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      task: Task;
      notification: { status: "sent" | "skipped" | "failed"; to?: string | null; detail?: string };
    }> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { resolveWorkspace, sendCompletionEmail } = await import("./tethra.server");
      const ws = await resolveWorkspace(data.token);
      const { data: row, error } = await supabaseAdmin
        .from("tasks")
        .update({
          status: data.completed ? "completed" : "open",
          completed_at: data.completed ? new Date().toISOString() : null,
          notification_status: data.completed ? "pending" : null,
        })
        .eq("id", data.id)
        .eq("workspace_id", ws.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      const task = row as Task;

      if (!data.completed) return { task, notification: { status: "skipped" } };

      let projectName: string | null = null;
      if (task.project_id) {
        const { data: project } = await supabaseAdmin
          .from("projects")
          .select("name")
          .eq("id", task.project_id)
          .maybeSingle();
        projectName = project?.name ?? null;
      }

      const notification = await sendCompletionEmail(ws, task, projectName);
      const { data: updated } = await supabaseAdmin
        .from("tasks")
        .update({ notification_status: notification.status })
        .eq("id", task.id)
        .select("*")
        .single();

      return { task: (updated as Task) ?? task, notification };
    },
  );

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        id: z.string().uuid().optional(),
        name: z.string().trim().min(1).max(120),
        target: z.string().max(300).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<Project> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("projects")
        .update({ name: data.name, target: data.target ?? null })
        .eq("id", data.id)
        .eq("workspace_id", ws.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return row as Project;
    }
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .insert({ workspace_id: ws.id, name: data.name, target: data.target ?? null })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as Project;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().uuid(), id: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", data.id)
      .eq("workspace_id", ws.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        name: z.string().trim().min(1).max(80).optional(),
        email: z.string().trim().email().optional(),
        founder_name: z.string().max(80).nullable().optional(),
        founder_email: z.union([z.string().email(), z.literal("")]).nullable().optional(),
        email_notifications: z.boolean().optional(),
        default_priority: z.string().max(20).optional(),
        default_timeframe: z.string().max(20).optional(),
        theme: z.enum(["light", "dark", "system"]).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<BoardData["workspace"]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { token, ...patch } = data;
    void token;
    const clean = {
      ...patch,
      founder_email: patch.founder_email ? patch.founder_email : null,
    };
    const { data: row, error } = await supabaseAdmin
      .from("workspaces")
      .update(stripUndefined(clean))
      .eq("id", ws.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    const { token: _t, ...workspace } = row as BoardData["workspace"] & { token: string };
    void _t;
    return workspace;
  });

export const listAttachments = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ token: z.string().uuid(), taskId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }): Promise<(Attachment & { url: string | null })[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { data: rows, error } = await supabaseAdmin
      .from("task_attachments")
      .select("*")
      .eq("task_id", data.taskId)
      .eq("workspace_id", ws.id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const list = (rows ?? []) as Attachment[];
    return Promise.all(
      list.map(async (row) => {
        const { data: signed } = await supabaseAdmin.storage
          .from("task-attachments")
          .createSignedUrl(row.file_path, 60 * 30);
        return { ...row, url: signed?.signedUrl ?? null };
      }),
    );
  });

export const createAttachmentUpload = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        taskId: z.string().uuid(),
        fileName: z.string().trim().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ path: string; signedUrl: string; token: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { data: task } = await supabaseAdmin
      .from("tasks")
      .select("id")
      .eq("id", data.taskId)
      .eq("workspace_id", ws.id)
      .maybeSingle();
    if (!task) throw new Error("Task not found");
    const safe = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
    const path = `${ws.id}/${data.taskId}/${crypto.randomUUID()}-${safe}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("task-attachments")
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error(error?.message ?? "Could not prepare upload");
    return { path, signedUrl: signed.signedUrl, token: signed.token };
  });

export const registerAttachment = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().uuid(),
        taskId: z.string().uuid(),
        path: z.string().min(1),
        fileName: z.string().min(1).max(200),
        mimeType: z.string().max(120).nullable().optional(),
        size: z.number().int().nonnegative().max(25 * 1024 * 1024),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<Attachment> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    if (!data.path.startsWith(`${ws.id}/${data.taskId}/`)) throw new Error("Invalid file path");
    const { data: row, error } = await supabaseAdmin
      .from("task_attachments")
      .insert({
        task_id: data.taskId,
        workspace_id: ws.id,
        file_path: data.path,
        file_name: data.fileName,
        mime_type: data.mimeType ?? null,
        size_bytes: data.size,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as Attachment;
  });

export const deleteAttachment = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().uuid(), id: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { resolveWorkspace } = await import("./tethra.server");
    const ws = await resolveWorkspace(data.token);
    const { data: row } = await supabaseAdmin
      .from("task_attachments")
      .select("*")
      .eq("id", data.id)
      .eq("workspace_id", ws.id)
      .maybeSingle();
    if (!row) return { ok: true };
    await supabaseAdmin.storage.from("task-attachments").remove([row.file_path]);
    await supabaseAdmin.from("task_attachments").delete().eq("id", data.id);
    return { ok: true };
  });
