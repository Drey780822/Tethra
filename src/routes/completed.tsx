import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, EmptyWorkspace } from "@/components/tethra/AppShell";
import { TaskCard } from "@/components/tethra/TaskCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoard, useToggleTask } from "@/hooks/useTethra";
import { formatDate, type Task } from "@/lib/tethra-types";

export const Route = createFileRoute("/completed")({
  head: () => ({
    meta: [
      { title: "Completed — Tethra" },
      { name: "description", content: "Everything you've cleared off your Tethra board, newest first." },
      { property: "og:title", content: "Completed — Tethra" },
      { property: "og:description", content: "Your completion history, newest first." },
    ],
  }),
  component: CompletedPage,
});

function CompletedPage() {
  const board = useBoard();
  const toggle = useToggleTask(board.token);
  const [query, setQuery] = useState("");

  const projects = board.data?.projects ?? [];
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const done = (board.data?.tasks ?? [])
      .filter((task) => task.status === "completed")
      .filter((task) => !q || task.title.toLowerCase().includes(q))
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));

    const map = new Map<string, Task[]>();
    for (const task of done) {
      const key = formatDate(task.completed_at) || "Earlier";
      map.set(key, [...(map.get(key) ?? []), task]);
    }
    return [...map.entries()];
  }, [board.data?.tasks, query]);

  if (!board.ready) return null;
  if (!board.token) {
    return (
      <AppShell>
        <EmptyWorkspace />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Completed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Proof the board keeps moving. Untick anything to bring it back.
          </p>
        </div>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search completed tasks"
          aria-label="Search completed tasks"
        />

        {board.isLoading ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : groups.length ? (
          <div className="space-y-6">
            {groups.map(([day, tasks]) => (
              <section key={day} aria-label={day}>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </h2>
                <ul className="mt-2 space-y-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={projects.find((p) => p.id === task.project_id)}
                      onOpen={() => undefined}
                      onToggle={async (t) => {
                        await toggle.mutateAsync({ id: t.id, completed: false });
                        toast.success("Task reopened");
                      }}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing completed yet.
          </p>
        )}
      </div>
    </AppShell>
  );
}
