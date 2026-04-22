import { track } from '@/lib/track';
import { logCheck, unlogCheck } from './check-log';

const STORAGE_KEY = 'checked-streams';

const listeners = new Set<() => void>();
let cache: Set<string> | null = null;

function readSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  cache = set;
  listeners.forEach((cb) => cb());
}

export function getCheckedSnapshot(): Set<string> {
  if (!cache) cache = readSet();
  return cache;
}

const EMPTY_SET = new Set<string>();

export function getCheckedServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

export function subscribeChecked(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function bulkCheck(videoIds: string[]): void {
  const set = new Set(getCheckedSnapshot());
  for (const id of videoIds) {
    if (!set.has(id)) {
      set.add(id);
      logCheck(id);
      track('stream_check', { action: 'add', targetId: id });
    }
  }
  writeSet(set);
}

export function toggleChecked(videoId: string): void {
  const set = new Set(getCheckedSnapshot());
  if (set.has(videoId)) {
    set.delete(videoId);
    unlogCheck(videoId);
    track('stream_check', { action: 'remove', targetId: videoId });
  } else {
    set.add(videoId);
    logCheck(videoId);
    track('stream_check', { action: 'add', targetId: videoId });
  }
  writeSet(set);
}
