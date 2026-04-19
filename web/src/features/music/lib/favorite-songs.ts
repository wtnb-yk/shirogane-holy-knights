const STORAGE_KEY = 'favorite-songs';

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

export function getFavoritesSnapshot(): Set<string> {
  if (!cache) cache = readSet();
  return cache;
}

const EMPTY_SET = new Set<string>();

export function getFavoritesServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

export function subscribeFavorites(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function toggleFavorite(songId: string): void {
  const set = new Set(getFavoritesSnapshot());
  if (set.has(songId)) {
    set.delete(songId);
  } else {
    set.add(songId);
  }
  writeSet(set);
}
