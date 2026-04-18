import type { Stream } from '@/lib/data/types';
import { formatDate } from '@/lib/format';
import { extractSeriesName } from './series-detector';

const GAME_TAG_ID = 2;

export type ReportStats = {
  streamCount: number;
  daysSinceFirst: number;
  totalHours: number;
  topGenre: { name: string; count: number } | null;
  maxStreak: number;
  lastWatchedDate: string;
  favoriteSeries: string | null;
};

const EMPTY_STATS: ReportStats = {
  streamCount: 0,
  daysSinceFirst: 0,
  totalHours: 0,
  topGenre: null,
  maxStreak: 0,
  lastWatchedDate: '',
  favoriteSeries: null,
};

/** HH:MM:SS → 秒数 */
function parseDurationToSeconds(dur: string): number {
  const parts = dur.split(':').map(Number);
  if (parts.length !== 3) return 0;
  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
}

/** 日付文字列から YYYY-MM-DD 部分を抽出 */
function toDateKey(dateStr: string): string {
  return dateStr.slice(0, 10);
}

/** ユニーク日付の昇順配列から、連続日の最長ランを算出 */
function longestConsecutiveStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / 86_400_000);

    if (diffDays === 1) {
      current++;
      if (current > maxStreak) maxStreak = current;
    } else {
      current = 1;
    }
  }

  return maxStreak;
}

/**
 * 全配信データ + チェック済みIDから統計を算出する純粋関数
 */
export function computeStats(
  allStreams: Stream[],
  checkedIds: Set<string>,
): ReportStats {
  if (checkedIds.size === 0) return EMPTY_STATS;

  const checked = allStreams.filter((s) => checkedIds.has(s.id));
  if (checked.length === 0) return EMPTY_STATS;

  // --- streamCount ---
  const streamCount = checked.length;

  // --- daysSinceFirst ---
  const dates = checked.map((s) => s.startedAt).sort();
  const earliest = new Date(dates[0]);
  const now = new Date();
  const daysSinceFirst = Math.floor(
    (now.getTime() - earliest.getTime()) / 86_400_000,
  );

  // --- totalHours ---
  const totalSeconds = checked.reduce(
    (sum, s) => sum + parseDurationToSeconds(s.duration),
    0,
  );
  const totalHours = Math.floor(totalSeconds / 3600);

  // --- topGenre ---
  const tagCounts = new Map<string, number>();
  for (const s of checked) {
    for (const t of s.tags) {
      tagCounts.set(t.name, (tagCounts.get(t.name) ?? 0) + 1);
    }
  }
  let topGenre: ReportStats['topGenre'] = null;
  let maxTagCount = 0;
  for (const [name, count] of tagCounts) {
    if (count > maxTagCount) {
      maxTagCount = count;
      topGenre = { name, count };
    }
  }

  // --- maxStreak ---
  const uniqueDates = [...new Set(checked.map((s) => toDateKey(s.startedAt)))]
    .filter((d) => d.length === 10)
    .sort();
  const maxStreak = longestConsecutiveStreak(uniqueDates);

  // --- lastWatchedDate ---
  const latest = dates[dates.length - 1];
  const lastWatchedDate = formatDate(latest);

  // --- favoriteSeries ---
  const seriesCounts = new Map<string, number>();
  for (const s of checked) {
    const hasGameTag = s.tags.some((t) => t.id === GAME_TAG_ID);
    if (!hasGameTag) continue;
    const series = extractSeriesName(s.title);
    if (series) {
      seriesCounts.set(series, (seriesCounts.get(series) ?? 0) + 1);
    }
  }
  let favoriteSeries: string | null = null;
  let maxSeriesCount = 0;
  for (const [name, count] of seriesCounts) {
    if (count > maxSeriesCount) {
      maxSeriesCount = count;
      favoriteSeries = name;
    }
  }

  return {
    streamCount,
    daysSinceFirst,
    totalHours,
    topGenre,
    maxStreak,
    lastWatchedDate,
    favoriteSeries,
  };
}
