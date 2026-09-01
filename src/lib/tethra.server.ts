import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Task, Workspace } from "./tethra-types";

/**
 * Resolves the workspace behind a browser-held access key.
 * Every server function must call this before touching data.
 */
export async function resolveWorkspace(token: string): Promise<Workspace & { token: string }> {
  const { data, error } = await supabaseAdmin
    .from("workspaces")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Workspace not found");
  return data as Workspace & { token: string };
}

export type NotificationResult = {
  status: "sent" | "skipped" | "failed";
  to?: string | null;
  detail?: string;
};

/**
 * Sends the founder/manager completion notification through the configured
 * email provider. Credentials come from environment variables only.
 */
export async function sendCompletionEmail(
  workspace: Workspace,
  task: Task,
  projectName: string | null,
): Promise<NotificationResult> {
  const apiKey = process.env["EMAIL_PROVIDER_API_KEY"] ?? process.env["RESEND_API_KEY"];
  const from = process.env["EMAIL_FROM"];
  const to = workspace.founder_email || process.env["FOUNDER_EMAIL"] || null;

  if (!workspace.email_notifications) return { status: "skipped", detail: "Notifications are off" };
  if (!to) return { status: "skipped", detail: "No founder email configured" };
  if (!apiKey || !from) return { status: "skipped", detail: "Email provider not configured" };

  const founderName = workspace.founder_name || "there";
  const completed = new Date(task.completed_at ?? Date.now()).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows: [string, string][] = [
    ["Developer", workspace.name],
    ["Task", task.title],
    ["Project", projectName ?? "—"],
    ["Priority", task.priority],
    ["Target", task.target_type],
    ["Status", "Completed"],
    ["Completed", completed],
  ];

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#14181c;line-height:1.6">
  <p>Hi ${escapeHtml(founderName)},</p>
  <p>A development task has been completed in Tethra.</p>
  <table style="border-collapse:collapse;margin:16px 0">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#6b7280;font-size:13px">${k}</td><td style="padding:4px 0;font-size:14px"><strong>${escapeHtml(
            v,
          )}</strong></td></tr>`,
      )
      .join("")}
  </table>
  <p>The developer has completed the task and pushed the implementation.</p>
  <p style="color:#6b7280;font-size:13px">— Tethra</p>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Tethra — Task Completed: ${task.title}`,
        html,
      }),
    });
    if (!res.ok) {
      return { status: "failed", to, detail: `Provider responded ${res.status}` };
    }
    return { status: "sent", to };
  } catch (error) {
    return { status: "failed", to, detail: (error as Error).message };
  }
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
