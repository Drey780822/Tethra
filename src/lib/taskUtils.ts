import { Task, TimeTarget, BoardSection } from './types';

export function timeTargetToSection(target: TimeTarget): BoardSection {
  switch (target) {
    case 'TODAY': return 'TODAY';
    case 'THIS_WEEK': case'THIS_WEEKEND': case'NEXT_WEEK': return 'THIS_WEEK';
    case 'THIS_MONTH': case'NEXT_MONTH': return 'THIS_MONTH';
    case 'BACKLOG': return 'BACKLOG';
    case 'LATER': return 'LATER';
    default: return 'LATER';
  }
}

export function getTasksForSection(tasks: Task[], section: BoardSection): Task[] {
  if (section === 'COMPLETED') {
    return tasks.filter(t => t.status === 'COMPLETED');
  }
  return tasks.filter(
    t => t.status !== 'COMPLETED' && timeTargetToSection(t.timeTarget) === section
  );
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function formatDateFull(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(' ')[0];
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function parseBulkTasks(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);
}

export function parseStructuredImport(text: string): {
  projectName: string;
  groups: Array<{ name: string; tasks: string[] }>;
} {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let projectName = 'Imported Project';
  const groups: Array<{ name: string; tasks: string[] }> = [];
  let currentGroup: { name: string; tasks: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith('—') || line.startsWith('--') || line.match(/^TARGET:/i)) continue;
    if (line.match(/^WEEKEND\s+\d+/i) || line.match(/^PHASE\s+\d+/i) || line.match(/^SPRINT\s+\d+/i) || line.match(/^WEEK\s+\d+/i)) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { name: line, tasks: [] };
    } else if (line.match(/^[-•*]\s+/) || (currentGroup && !line.includes(':') && !line.match(/^[A-Z\s]+:$/))) {
      const task = line.replace(/^[-•*]\s*/, '').trim();
      if (task && currentGroup) {
        currentGroup.tasks.push(task);
      } else if (task && groups.length === 0) {
        if (!currentGroup) currentGroup = { name: 'Tasks', tasks: [] };
        currentGroup.tasks.push(task);
      }
    } else if (!currentGroup && line.length > 3 && !line.includes(':')) {
      projectName = line;
    } else if (line.match(/^[A-Z][^:]+$/)) {
      projectName = line;
    }
  }
  if (currentGroup) groups.push(currentGroup);
  return { projectName, groups };
}

export function effortLabel(effort: string | null): string {
  if (!effort) return '';
  const map: Record<string, string> = {
    QUICK: 'Quick',
    HALF_DAY: 'Half day',
    FULL_DAY: 'Full day',
    WEEKEND: 'Weekend',
    MULTI_WEEK: 'Multi-week',
    LONG_TERM: 'Long term',
  };
  return map[effort] || effort;
}

export function timeTargetLabel(target: TimeTarget): string {
  const map: Record<TimeTarget, string> = {
    TODAY: 'Today',
    THIS_WEEK: 'This week',
    THIS_WEEKEND: 'This weekend',
    NEXT_WEEK: 'Next week',
    THIS_MONTH: 'This month',
    NEXT_MONTH: 'Next month',
    LATER: 'Later',
    BACKLOG: 'Backlog',
    CUSTOM: 'Custom',
  };
  return map[target] || target;
}