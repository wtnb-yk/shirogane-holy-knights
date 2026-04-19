import type { Stream } from '@/lib/data/types';
import { extractSeriesName } from './series-detector';

const GAME_TAG_ID = 2;

const DAY_NAMES = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];

export type GenreShare = {
  name: string;
  count: number;
  percentage: number;
};

export type ReportStats = {
  streamCount: number;
  totalHours: number;
  genreDistribution: GenreShare[];
  maxStreak: number;
  favoriteSeries: string | null;
  mostActiveDay: { day: string; count: number } | null;
  favoriteSongCount: number;
};

const EMPTY_STATS: ReportStats = {
  streamCount: 0,
  totalHours: 0,
  genreDistribution: [],
  maxStreak: 0,
  favoriteSeries: null,
  mostActiveDay: null,
  favoriteSongCount: 0,
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
  favoriteSongCount: number,
): ReportStats {
  if (checkedIds.size === 0) return { ...EMPTY_STATS, favoriteSongCount };

  const checked = allStreams.filter((s) => checkedIds.has(s.id));
  if (checked.length === 0) return { ...EMPTY_STATS, favoriteSongCount };

  // --- streamCount ---
  const streamCount = checked.length;

  // --- totalHours ---
  const totalSeconds = checked.reduce(
    (sum, s) => sum + parseDurationToSeconds(s.duration),
    0,
  );
  const totalHours = Math.floor(totalSeconds / 3600);

  // --- genreDistribution (上位4件) ---
  const tagCounts = new Map<string, number>();
  for (const s of checked) {
    for (const t of s.tags) {
      tagCounts.set(t.name, (tagCounts.get(t.name) ?? 0) + 1);
    }
  }
  const totalTags = [...tagCounts.values()].reduce((a, b) => a + b, 0);
  const genreDistribution: GenreShare[] = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalTags > 0 ? Math.round((count / totalTags) * 100) : 0,
    }));

  // --- maxStreak ---
  const uniqueDates = [...new Set(checked.map((s) => toDateKey(s.startedAt)))]
    .filter((d) => d.length === 10)
    .sort();
  const maxStreak = longestConsecutiveStreak(uniqueDates);

  // --- mostActiveDay ---
  const dayCounts = new Array<number>(7).fill(0);
  for (const s of checked) {
    const d = new Date(s.startedAt);
    if (!Number.isNaN(d.getTime())) {
      dayCounts[d.getDay()]++;
    }
  }
  const maxDayCount = Math.max(...dayCounts);
  const mostActiveDay =
    maxDayCount > 0
      ? { day: DAY_NAMES[dayCounts.indexOf(maxDayCount)], count: maxDayCount }
      : null;

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
    totalHours,
    genreDistribution,
    maxStreak,
    favoriteSeries,
    mostActiveDay,
    favoriteSongCount,
  };
}
