/**
 * チェック日付の記録ストア
 *
 * checked-streams とは別に、各配信をチェックした日付を記録する。
 * ヒートマップ（団員のあしあと）で「いつチェックしたか」を可視化するために使用。
 *
 * データ構造: { [videoId]: "YYYY-MM-DD" }
 */

const LOG_KEY = 'check-log';

const listeners = new Set<() => void>();
let cache: Map<string, string> | null = null;

function readLog(): Map<string, string> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return new Map();
    return new Map(Object.entries(JSON.parse(raw) as Record<string, string>));
  } catch {
    return new Map();
  }
}

function writeLog(map: Map<string, string>): void {
  localStorage.setItem(LOG_KEY, JSON.stringify(Object.fromEntries(map)));
  cache = map;
  listeners.forEach((cb) => cb());
}

export function getCheckLogSnapshot(): Map<string, string> {
  if (!cache) cache = readLog();
  return cache;
}

const EMPTY_LOG = new Map<string, string>();

export function getCheckLogServerSnapshot(): Map<string, string> {
  return EMPTY_LOG;
}

export function subscribeCheckLog(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function logCheck(videoId: string): void {
  const map = new Map(getCheckLogSnapshot());
  map.set(videoId, new Date().toISOString().slice(0, 10));
  writeLog(map);
}

export function unlogCheck(videoId: string): void {
  const map = new Map(getCheckLogSnapshot());
  map.delete(videoId);
  writeLog(map);
}
