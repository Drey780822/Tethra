import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell, EmptyWorkspace } from "@/components/tethra/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBoard, useDeleteProject, useSaveProject, useSaveSettings } from "@/hooks/useTethra";
import { PRIORITIES, TARGETS } from "@/lib/tethra-types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tethra" },
      { name: "description", content: "Manage your Tethra workspace: defaults, projects, notifications and your workspace key." },
      { property: "og:title", content: "Settings — Tethra" },
      { property: "og:description", content: "Defaults, projects, notifications and your workspace key." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const board = useBoard();
  const save = useSaveSettings(board.token);
  const saveProject = useSaveProject(board.token);
  const removeProject = useDeleteProject(board.token);

  const workspace = board.data?.workspace;
  const [form, setForm] = useState({
    name: "",
    email: "",
    founder_name: "",
    founder_email: "",
    email_notifications: true,
    default_priority: "MEDIUM",
    default_timeframe: "TODAY",
  });
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    if (!workspace) return;
    setForm({
      name: workspace.name,
      email: workspace.email,
      founder_name: workspace.founder_name ?? "",
      founder_email: workspace.founder_email ?? "",
      email_notifications: workspace.email_notifications,
      default_priority: workspace.default_priority,
      default_timeframe: workspace.default_timeframe,
    });
  }, [workspace]);

  if (!board.ready) return null;
  if (!board.token) {
    return (
      <AppShell>
        <EmptyWorkspace />
      </AppShell>
    );
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    try {
      await save.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        founder_name: form.founder_name.trim() || null,
        founder_email: form.founder_email.trim() || null,
        email_notifications: form.email_notifications,
        default_priority: form.default_priority,
        default_timeframe: form.default_timeframe,
      });
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save settings");
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your workspace, your defaults, your projects.
          </p>
        </div>

        <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Workspace</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Your name</Label>
              <Input
                id="s-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-priority">Default priority</Label>
              <Select
                value={form.default_priority}
                onValueChange={(v) => setForm({ ...form, default_priority: v })}
              >
                <SelectTrigger id="s-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-target">Default target</Label>
              <Select
                value={form.default_timeframe}
                onValueChange={(v) => setForm({ ...form, default_timeframe: v })}
              >
                <SelectTrigger id="s-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGETS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide">Notifications</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">Email on completion</p>
              <p className="text-xs text-muted-foreground">
                Sent securely from the server when you tick a task off.
              </p>
            </div>
            <Switch
              checked={form.email_notifications}
              onCheckedChange={(v) => setForm({ ...form, email_notifications: v })}
              aria-label="Email on completion"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-fname">Founder name</Label>
              <Input
                id="s-fname"
                value={form.founder_name}
                onChange={(e) => setForm({ ...form, founder_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-femail">Founder email</Label>
              <Input
                id="s-femail"
                type="email"
                value={form.founder_email}
                onChange={(e) => setForm({ ...form, founder_email: e.target.value })}
                placeholder="founder@example.com"
              />
            </div>
          </div>

          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save settings"}
          </Button>
        </form>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Projects</h2>
          <form
            className="flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const name = newProject.trim();
              if (!name) return;
              setNewProject("");
              await saveProject.mutateAsync({ name });
              toast.success("Project added");
            }}
          >
            <Input
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="New project name"
              aria-label="New project name"
            />
            <Button type="submit" variant="secondary">
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </Button>
          </form>
          {board.data?.projects.length ? (
            <ul className="divide-y divide-border">
              {board.data.projects.map((project) => (
                <li key={project.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{project.name}</span>
                  <button
                    type="button"
                    aria-label={`Delete ${project.name}`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      await removeProject.mutateAsync(project.id);
                      toast.success("Project removed");
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          )}
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Workspace key</h2>
          <p className="text-sm text-muted-foreground">
            This key is your login. Save it somewhere safe to open this board on another device.
          </p>
          <div className="flex flex-wrap gap-2">
            <Input readOnly value={board.token} aria-label="Workspace key" className="flex-1 font-mono text-xs" />
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(board.token as string);
                toast.success("Key copied");
              }}
            >
              <Copy className="h-4 w-4" aria-hidden />
              Copy
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                board.resetToken();
                void navigate({ to: "/" });
              }}
            >
              Sign out of this device
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
