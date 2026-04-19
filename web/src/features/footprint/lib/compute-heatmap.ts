import type { Stream } from '@/lib/data/types';

export type HeatmapCell = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3;
};

export type MonthLabel = {
  name: string;
  span: number;
};

export type HeatmapData = {
  year: number;
  cells: HeatmapCell[];
  months: MonthLabel[];
  totalColumns: number;
  activeDays: number;
  maxStreak: number;
  totalStreams: number;
};

const MONTH_NAMES = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

function countToLevel(count: number): 0 | 1 | 2 | 3 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

/** 月曜始まりの曜日インデックス (0=月, 6=日) */
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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
 * ヒートマップデータを構築する純粋関数
 *
 * Stream[] と checkedIds から、指定年のヒートマップグリッドと統計を算出する。
 */
export function computeHeatmap(
  allStreams: Stream[],
  checkedIds: Set<string>,
  year: number,
): HeatmapData {
  // 対象年のチェック済み配信を日付別に集計
  const dateCountMap = new Map<string, number>();
  const yearPrefix = String(year);

  for (const s of allStreams) {
    if (!checkedIds.has(s.id)) continue;
    const dateKey = s.startedAt.slice(0, 10);
    if (!dateKey.startsWith(yearPrefix)) continue;
    dateCountMap.set(dateKey, (dateCountMap.get(dateKey) ?? 0) + 1);
  }

  // グリッド起点: year/1/1 を含む週の月曜日
  const jan1 = new Date(year, 0, 1);
  const gridStart = addDays(jan1, -mondayIndex(jan1));

  // グリッド終点: year/12/31 を含む週の日曜日
  const dec31 = new Date(year, 11, 31);
  const gridEnd = addDays(dec31, 6 - mondayIndex(dec31));

  const totalDays =
    Math.round((gridEnd.getTime() - gridStart.getTime()) / 86_400_000) + 1;
  const totalColumns = totalDays / 7;

  // セル生成 (grid-auto-flow: column 用に列順で格納)
  const cells: HeatmapCell[] = [];
  for (let d = 0; d < totalDays; d++) {
    const cellDate = addDays(gridStart, d);
    const dateKey = toDateKey(cellDate);
    const count = dateCountMap.get(dateKey) ?? 0;
    cells.push({ date: dateKey, count, level: countToLevel(count) });
  }

  // 月ラベル
  const months: MonthLabel[] = [];
  const columnStarts: number[] = [];

  for (let m = 0; m < 12; m++) {
    const firstOfMonth = new Date(year, m, 1);
    const dayOffset = Math.round(
      (firstOfMonth.getTime() - gridStart.getTime()) / 86_400_000,
    );
    const columnIndex = Math.floor(dayOffset / 7);
    columnStarts.push(columnIndex);
  }

  for (let m = 0; m < 12; m++) {
    const span =
      m < 11
        ? columnStarts[m + 1] - columnStarts[m]
        : totalColumns - columnStarts[m];
    months.push({ name: MONTH_NAMES[m], span });
  }

  // 統計
  const activeDays = [...dateCountMap.values()].filter((c) => c > 0).length;
  const totalStreams = [...dateCountMap.values()].reduce((a, b) => a + b, 0);
  const sortedDates = [...dateCountMap.keys()]
    .filter((d) => (dateCountMap.get(d) ?? 0) > 0)
    .sort();
  const maxStreak = longestConsecutiveStreak(sortedDates);

  return {
    year,
    cells,
    months,
    totalColumns,
    activeDays,
    maxStreak,
    totalStreams,
  };
}

/** 空セルで埋めたヒートマップデータ */
export function emptyHeatmap(year: number): HeatmapData {
  return computeHeatmap([], new Set(), year);
}
