export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TimeTarget =
  | 'TODAY' |'THIS_WEEK' |'THIS_WEEKEND' |'NEXT_WEEK' |'THIS_MONTH' |'NEXT_MONTH' |'LATER' |'BACKLOG' |'CUSTOM';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type EstimatedEffort =
  | 'QUICK' |'HALF_DAY' |'FULL_DAY' |'WEEKEND' |'MULTI_WEEK' |'LONG_TERM';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  projectId: string | null;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  timeTarget: TimeTarget;
  dueDate: string | null;
  estimatedEffort: EstimatedEffort | null;
  notes: string;
  attachments: Attachment[];
  createdAt: string;
  completedAt: string | null;
  emailNotificationStatus: 'PENDING' | 'SENT' | 'FAILED' | 'NOT_SENT';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  founderEmail: string;
  founderName: string;
  theme: 'light' | 'dark' | 'system';
  defaultPriority: Priority;
  defaultTimeTarget: TimeTarget;
  emailNotificationsEnabled: boolean;
  taskCompletionNotificationsEnabled: boolean;
  createdAt: string;
}

export type BoardSection =
  | 'TODAY' |'THIS_WEEK' |'THIS_MONTH' |'LATER' |'BACKLOG' |'COMPLETED';

export interface ParsedImport {
  projectName: string;
  target: string;
  groups: Array<{
    name: string;
    tasks: string[];
  }>;
}