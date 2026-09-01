export const PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const TARGETS = [
  "TODAY",
  "THIS WEEK",
  "THIS WEEKEND",
  "NEXT WEEK",
  "THIS MONTH",
  "NEXT MONTH",
  "LATER",
  "BACKLOG",
] as const;
export type TargetType = (typeof TARGETS)[number];

export const EFFORTS = [
  "QUICK",
  "HALF DAY",
  "FULL DAY",
  "WEEKEND",
  "MULTI-WEEK",
  "LONG TERM",
] as const;
export type Effort = (typeof EFFORTS)[number];

/** Whiteboard sections, in the order they appear on the board. */
export const SECTIONS: { key: string; label: string; targets: TargetType[] }[] = [
  { key: "today", label: "Today", targets: ["TODAY"] },
  { key: "week", label: "This week", targets: ["THIS WEEK", "THIS WEEKEND", "NEXT WEEK"] },
  { key: "month", label: "This month", targets: ["THIS MONTH", "NEXT MONTH"] },
  { key: "later", label: "Later", targets: ["LATER"] },
  { key: "backlog", label: "Backlog", targets: ["BACKLOG"] },
];

export type Task = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  notes: string | null;
  group_label: string | null;
  status: string;
  priority: string;
  target_type: string;
  due_date: string | null;
  estimated_effort: string | null;
  position: number;
  notification_status: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Project = {
  id: string;
  workspace_id: string;
  name: string;
  target: string | null;
  created_at: string;
};

export type Workspace = {
  id: string;
  name: string;
  email: string;
  founder_name: string | null;
  founder_email: string | null;
  email_notifications: boolean;
  default_priority: string;
  default_timeframe: string;
  theme: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type BoardData = {
  workspace: Workspace;
  projects: Project[];
  tasks: Task[];
};

export type ParsedImport = {
  projectName: string | null;
  target: string | null;
  tasks: { title: string; group_label: string | null }[];
};

const HEADING_TARGET = /^target\s*[:\-–]\s*(.+)$/i;

/**
 * Interprets a pasted structured list:
 *  - first non-list line becomes the board/project name
 *  - a "TARGET: ..." line becomes the project target
 *  - other heading lines become group labels
 *  - remaining lines become tasks
 */
export function parseStructuredList(raw: string): ParsedImport {
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.trim().length > 0);

  let projectName: string | null = null;
  let target: string | null = null;
  let group: string | null = null;
  const tasks: { title: string; group_label: string | null }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const bullet = /^([-*•]|\d+[.)])\s+/.test(trimmed);
    const clean = trimmed.replace(/^([-*•]|\d+[.)])\s+/, "").replace(/^#+\s*/, "");

    const targetMatch = HEADING_TARGET.exec(clean);
    if (!bullet && targetMatch) {
      target = (targetMatch[1] ?? "").trim();
      continue;
    }

    const looksLikeHeading =
      !bullet &&
      (/^#/.test(trimmed) ||
        (clean === clean.toUpperCase() && /[A-Z]/.test(clean) && clean.length <= 80));

    if (looksLikeHeading) {
      if (!projectName) projectName = titleCase(clean);
      else group = titleCase(clean);
      continue;
    }

    tasks.push({ title: clean, group_label: group });
  }

  return { projectName, target, tasks };
}

/** Splits a plain bulk paste into task titles (one per line). */
export function parseBulkList(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim().replace(/^([-*•]|\d+[.)])\s+/, ""))
    .filter((l) => l.length > 0);
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 2 && !word.includes("—") ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ")
    .replace(/^(\w)/, (m) => m.toUpperCase());
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
