import path from 'node:path';

export function managerEntries(entry: string[] = []) {
  return [...entry, path.resolve(import.meta.dirname, 'manager.tsx')];
}
