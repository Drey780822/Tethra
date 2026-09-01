import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, EmptyWorkspace } from "@/components/tethra/AppShell";
import { ImportDialog } from "@/components/tethra/ImportDialog";
import { TaskCard } from "@/components/tethra/TaskCard";
import { TaskDialog } from "@/components/tethra/TaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoard, useCreateTasks, useToggleTask } from "@/hooks/useTethra";
import { greeting, PRIORITIES, SECTIONS, type Task } from "@/lib/tethra-types";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Your board — Tethra" },
      { name: "description", content: "Your personal Tethra whiteboard: targets, priorities and what's next." },
      { property: "og:title", content: "Your board — Tethra" },
      { property: "og:description", content: "Targets, priorities and what's next, on one calm board." },
    ],
  }),
  component: BoardPage,
});

const ALL = "__all__";

function BoardPage() {
  const board = useBoard();
  const token = board.token;
  const toggle = useToggleTask(token);
  const quickAdd = useCreateTasks(token);

  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState(ALL);
  const [projectId, setProjectId] = useState(ALL);
  const [quick, setQuick] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const [taskOpen, setTaskOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const workspace = board.data?.workspace;
  const projects = board.data?.projects ?? [];
  const defaults = useMemo(
    () => ({
      priority: workspace?.default_priority ?? "MEDIUM",
      target: workspace?.default_timeframe ?? "TODAY",
    }),
    [workspace?.default_priority, workspace?.default_timeframe],
  );

  const open = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (board.data?.tasks ?? []).filter((task) => {
      if (task.status === "completed") return false;
      if (priority !== ALL && task.priority !== priority) return false;
      if (projectId !== ALL && task.project_id !== projectId) return false;
      if (q && !`${task.title} ${task.notes ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [board.data?.tasks, query, priority, projectId]);

  if (!board.ready) return null;
  if (!token) {
    return (
      <AppShell>
        <EmptyWorkspace />
      </AppShell>
    );
  }

  async function onQuickAdd(event: React.FormEvent) {
    event.preventDefault();
    const title = quick.trim();
    if (!title) return;
    setQuick("");
    try {
      await quickAdd.mutateAsync({
        projectId: null,
        tasks: [{ title, priority: defaults.priority, target_type: defaults.target }],
      } as never);
    } catch {
      toast.error("Could not add that task");
    }
  }

  async function onToggle(task: Task) {
    try {
      const result = await toggle.mutateAsync({ id: task.id, completed: task.status !== "completed" });
      if (task.status !== "completed") {
        toast.success(
          result.notification.status === "sent" ? "Completed — notification sent" : "Completed",
        );
      }
    } catch {
      toast.error("Could not update that task");
    }
  }

  return (
    <AppShell
      action={
        <Button size="sm" onClick={() => { setEditing(null); setTaskOpen(true); }}>
          <Plus className="h-4 w-4" aria-hidden />
          New task
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {greeting()}
            {workspace?.name ? `, ${workspace.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {open.length} open {open.length === 1 ? "task" : "tasks"} on the board.
          </p>
        </div>

        <form onSubmit={onQuickAdd} className="flex gap-2">
          <Input
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="Add a task and press enter…"
            aria-label="Quick add a task"
          />
          <Button type="submit" variant="secondary" disabled={!quick.trim()}>
            Add
          </Button>
          <Button type="button" variant="ghost" onClick={() => setImportOpen(true)} aria-label="Import tasks">
            <Upload className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Import</span>
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
              className="pl-9"
            />
          </div>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[9.5rem]" aria-label="Filter by priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-[10.5rem]" aria-label="Filter by project">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {board.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => {
              const tasks = open.filter((task) => section.targets.includes(task.target_type as never));
              return (
                <section
                  key={section.key}
                  className="board-surface rounded-2xl border border-border p-4"
                  aria-label={section.label}
                >
                  <h2 className="flex items-baseline justify-between text-sm font-semibold uppercase tracking-wide">
                    {section.label}
                    <span className="text-xs font-normal text-muted-foreground">{tasks.length}</span>
                  </h2>
                  {tasks.length ? (
                    <ul className="mt-3 space-y-2">
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          project={projects.find((p) => p.id === task.project_id)}
                          onToggle={onToggle}
                          onOpen={(t) => {
                            setEditing(t);
                            setTaskOpen(true);
                          }}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">Nothing here yet.</p>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      <TaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        token={token}
        task={editing}
        projects={projects}
        defaults={defaults}
      />
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        token={token}
        defaults={defaults}
      />
    </AppShell>
  );
}
