import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate, type Project, type Task } from "@/lib/tethra-types";

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "text-high border-high/40 bg-high/10",
  MEDIUM: "text-medium border-medium/40 bg-medium/10",
  LOW: "text-low border-low/30 bg-low/10",
};

export function TaskCard({
  task,
  project,
  onToggle,
  onOpen,
}: {
  task: Task;
  project?: Project | undefined;
  onToggle: (task: Task) => void;
  onOpen: (task: Task) => void;
}) {
  const done = task.status === "completed";

  return (
    <li className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-marker/50">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={done ? `Reopen ${task.title}` : `Complete ${task.title}`}
          onClick={() => onToggle(task)}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border transition-colors",
            done ? "border-marker bg-marker text-marker-foreground tick-pop" : "hover:border-marker",
          )}
        >
          {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
        </button>

        <button
          type="button"
          onClick={() => onOpen(task)}
          className="min-w-0 flex-1 text-left"
          aria-label={`Edit ${task.title}`}
        >
          <p className={cn("text-sm font-medium leading-snug", done && "text-muted-foreground line-through")}>
            {task.title}
          </p>
          {task.notes ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.notes}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-medium",
                PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE["LOW"],
              )}
            >
              {task.priority}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground">
              {task.target_type}
            </span>
            {task.estimated_effort ? (
              <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground">
                {task.estimated_effort}
              </span>
            ) : null}
            {project ? (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                {project.name}
              </span>
            ) : null}
            {task.due_date ? (
              <span className="text-muted-foreground">Due {formatDate(task.due_date)}</span>
            ) : null}
          </div>
        </button>
      </div>
    </li>
  );
}
