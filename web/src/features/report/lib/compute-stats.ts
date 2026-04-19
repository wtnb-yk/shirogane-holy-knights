import type { Stream } from '@/lib/data/types';

export type GenreShare = {
  name: string;
  count: number;
};

export type ReportStats = {
  streamCount: number;
  genreDistribution: GenreShare[];
  weekdayDistribution: number[];
  coverageRate: number;
  weeklyAverage: number;
  maxStreak: number;
  favoriteSongCount: number;
};

const EMPTY_WEEKDAYS = [0, 0, 0, 0, 0, 0, 0];

export const EMPTY_STATS: ReportStats = {
  streamCount: 0,
  genreDistribution: [],
  weekdayDistribution: EMPTY_WEEKDAYS,
  coverageRate: 0,
  weeklyAverage: 0,
  maxStreak: 0,
  favoriteSongCount: 0,
};

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
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);

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

  const streamCount = checked.length;

  // --- genreDistribution (上位4件 + 「他」) ---
  const tagCounts = new Map<string, number>();
  for (const s of checked) {
    for (const t of s.tags) {
      tagCounts.set(t.name, (tagCounts.get(t.name) ?? 0) + 1);
    }
  }
  const sorted = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4).map(([name, count]) => ({ name, count }));
  const topSum = top.reduce((s, g) => s + g.count, 0);
  const totalTags = [...tagCounts.values()].reduce((a, b) => a + b, 0);
  const otherCount = totalTags - topSum;
  const genreDistribution: GenreShare[] =
    otherCount > 0 ? [...top, { name: '他', count: otherCount }] : top;

  // --- weekdayDistribution [日,月,火,水,木,金,土] ---
  const weekdayDistribution = new Array<number>(7).fill(0);
  for (const s of checked) {
    const d = new Date(s.startedAt);
    if (!Number.isNaN(d.getTime())) {
      weekdayDistribution[d.getDay()]++;
    }
  }

  // --- coverageRate ---
  const coverageRate =
    allStreams.length > 0
      ? Math.round((streamCount / allStreams.length) * 100)
      : 0;

  // --- weeklyAverage ---
  const dates = checked.map((s) => s.startedAt).sort();
  const earliest = new Date(dates[0]);
  const latest = new Date(dates[dates.length - 1]);
  const spanMs = latest.getTime() - earliest.getTime();
  const spanWeeks = Math.max(spanMs / (7 * 86_400_000), 1);
  const weeklyAverage = Math.round((streamCount / spanWeeks) * 10) / 10;

  // --- maxStreak ---
  const uniqueDates = [...new Set(checked.map((s) => toDateKey(s.startedAt)))]
    .filter((d) => d.length === 10)
    .sort();
  const maxStreak = longestConsecutiveStreak(uniqueDates);

  return {
    streamCount,
    genreDistribution,
    weekdayDistribution,
    coverageRate,
    weeklyAverage,
    maxStreak,
    favoriteSongCount,
  };
}
