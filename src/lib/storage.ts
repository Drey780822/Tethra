import { Task, Project, UserProfile } from './types';

const KEYS = {
  USER: 'tethra_user',
  TASKS: 'tethra_tasks',
  PROJECTS: 'tethra_projects',
} as const;

export function getUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.TASKS);
  localStorage.removeItem(KEYS.PROJECTS);
}