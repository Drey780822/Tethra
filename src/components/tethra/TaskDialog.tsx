import { Loader2, Paperclip, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAttachments,
  useCreateTasks,
  useDeleteAttachment,
  useDeleteTask,
  useUpdateTask,
  useUploadAttachment,
} from "@/hooks/useTethra";
import { EFFORTS, PRIORITIES, TARGETS, type Project, type Task } from "@/lib/tethra-types";

type Draft = {
  title: string;
  description: string;
  notes: string;
  priority: string;
  target_type: string;
  due_date: string;
  estimated_effort: string;
  project_id: string;
};

const NONE = "__none__";

function toDraft(task: Task | null, defaults: { priority: string; target: string }): Draft {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    notes: task?.notes ?? "",
    priority: task?.priority ?? defaults.priority,
    target_type: task?.target_type ?? defaults.target,
    due_date: task?.due_date ?? "",
    estimated_effort: task?.estimated_effort ?? NONE,
    project_id: task?.project_id ?? NONE,
  };
}

export function TaskDialog({
  open,
  onOpenChange,
  token,
  task,
  projects,
  defaults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
  task: Task | null;
  projects: Project[];
  defaults: { priority: string; target: string };
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(task, defaults));
  const fileInput = useRef<HTMLInputElement>(null);

  const create = useCreateTasks(token);
  const update = useUpdateTask(token);
  const remove = useDeleteTask(token);
  const attachments = useAttachments(token, task?.id ?? null);
  const upload = useUploadAttachment(token, task?.id ?? null);
  const dropAttachment = useDeleteAttachment(token, task?.id ?? null);

  useEffect(() => {
    if (open) setDraft(toDraft(task, defaults));
  }, [open, task, defaults]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const saving = create.isPending || update.isPending;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      notes: draft.notes.trim() || null,
      priority: draft.priority,
      target_type: draft.target_type,
      due_date: draft.due_date || null,
      estimated_effort: draft.estimated_effort === NONE ? null : draft.estimated_effort,
      project_id: draft.project_id === NONE ? null : draft.project_id,
    };
    try {
      if (task) {
        await update.mutateAsync({ id: task.id, patch: payload });
        toast.success("Task updated");
      } else {
        const { project_id, ...rest } = payload;
        await create.mutateAsync({ projectId: project_id, tasks: [rest] } as never);
        toast.success("Task added");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the task");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>Target it, size it, then get it off the board.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task</Label>
            <Input
              id="task-title"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="What needs doing?"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={draft.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger id="task-priority">
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
              <Label htmlFor="task-target">Target</Label>
              <Select value={draft.target_type} onValueChange={(v) => set("target_type", v)}>
                <SelectTrigger id="task-target">
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
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input
                id="task-due"
                type="date"
                value={draft.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-effort">Effort</Label>
              <Select
                value={draft.estimated_effort}
                onValueChange={(v) => set("estimated_effort", v)}
              >
                <SelectTrigger id="task-effort">
                  <SelectValue placeholder="Not sized" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Not sized</SelectItem>
                  {EFFORTS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-project">Project</Label>
            <Select value={draft.project_id} onValueChange={(v) => set("project_id", v)}>
              <SelectTrigger id="task-project">
                <SelectValue placeholder="No project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              rows={3}
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Context, links, next step…"
            />
          </div>

          {task ? (
            <div className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Attachments
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInput.current?.click()}
                  disabled={upload.isPending}
                >
                  {upload.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Paperclip className="h-4 w-4" aria-hidden />
                  )}
                  Add file
                </Button>
              </div>
              <input
                ref={fileInput}
                type="file"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  if (file.size > 25 * 1024 * 1024) {
                    toast.error("Files must be 25MB or smaller");
                    return;
                  }
                  try {
                    await upload.mutateAsync(file);
                    toast.success("File attached");
                  } catch {
                    toast.error("Could not upload that file");
                  }
                }}
              />
              {attachments.data?.length ? (
                <ul className="space-y-1">
                  {attachments.data.map((file) => (
                    <li key={file.id} className="flex items-center gap-2 text-sm">
                      <a
                        href={file.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 truncate underline-offset-4 hover:underline"
                      >
                        {file.file_name}
                      </a>
                      <button
                        type="button"
                        aria-label={`Remove ${file.file_name}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => dropAttachment.mutate(file.id)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No files yet.</p>
              )}
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:justify-between">
            {task ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={async () => {
                  await remove.mutateAsync(task.id);
                  toast.success("Task deleted");
                  onOpenChange(false);
                }}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {task ? "Save changes" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
