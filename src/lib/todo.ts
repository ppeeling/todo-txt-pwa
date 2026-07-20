export interface Task {
  id: string;
  raw: string;
  completed: boolean;
  priority: string | null;
  completionDate: string | null;
  creationDate: string | null;
  description: string;
  projects: string[];
  contexts: string[];
  tags: Record<string, string>;
}

export function parseTodo(line: string): Task {
  const original = line;
  let completed = false;
  let priority: string | null = null;
  let completionDate: string | null = null;
  let creationDate: string | null = null;
  
  let parts = line.trim().split(' ');

  if (parts[0] === 'x') {
    completed = true;
    parts.shift();
    if (parts.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
      completionDate = parts.shift() || null;
    }
  }

  if (parts.length > 0 && /^\([A-Z]\)$/.test(parts[0])) {
    priority = parts.shift()![1];
  }

  if (parts.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
    creationDate = parts.shift() || null;
  }

  const description = parts.join(' ');
  const projects: string[] = [];
  const contexts: string[] = [];
  const tags: Record<string, string> = {};

  for (const part of parts) {
    if (part.startsWith('+') && part.length > 1) {
      projects.push(part.substring(1));
    } else if (part.startsWith('@') && part.length > 1) {
      contexts.push(part.substring(1));
    } else {
      const colonIndex = part.indexOf(':');
      if (colonIndex > 0) {
        const key = part.substring(0, colonIndex);
        const value = part.substring(colonIndex + 1);
        tags[key] = value;
      }
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    raw: original,
    completed,
    priority,
    completionDate,
    creationDate,
    description,
    projects,
    contexts,
    tags,
  };
}

export function stringifyTask(task: Task): string {
  let parts = [];
  if (task.completed) {
    parts.push('x');
    if (task.completionDate) {
      parts.push(task.completionDate);
    }
  }
  if (task.priority) {
    parts.push(`(${task.priority})`);
  }
  if (task.creationDate) {
    parts.push(task.creationDate);
  }
  if (task.description) {
    parts.push(task.description);
  }
  return parts.join(' ');
}

// 3-way merge of string lines
export function mergeTasks(base: string[], local: string[], remote: string[]): string[] {
  const baseSet = new Set(base);
  const localSet = new Set(local);
  const remoteSet = new Set(remote);

  const localAdded = new Set([...localSet].filter(x => !baseSet.has(x)));
  const localRemoved = new Set([...baseSet].filter(x => !localSet.has(x)));
  
  const remoteAdded = new Set([...remoteSet].filter(x => !baseSet.has(x)));
  const remoteRemoved = new Set([...baseSet].filter(x => !remoteSet.has(x)));

  // Start with base
  let merged = new Set(baseSet);
  
  // Apply additions
  localAdded.forEach(x => merged.add(x));
  remoteAdded.forEach(x => merged.add(x));
  
  // Apply removals
  localRemoved.forEach(x => merged.delete(x));
  remoteRemoved.forEach(x => merged.delete(x));

  return Array.from(merged);
}
