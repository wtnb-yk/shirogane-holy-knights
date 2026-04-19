export type DayCell = {
  day: number;
  count: number;
  level: 0 | 1 | 2 | 3;
};

export type MonthData = {
  name: string;
  startDow: number;
  days: DayCell[];
};

export type HeatmapData = {
  year: number;
  months: MonthData[];
  activeDays: number;
  maxStreak: number;
  totalChecks: number;
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

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
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
 * チェック日付ログから月別グリッドのヒートマップデータを構築する
 *
 * checkLog: Map<videoId, checkedAt(YYYY-MM-DD)>
 */
export function computeHeatmap(
  checkLog: Map<string, string>,
  year: number,
): HeatmapData {
  // チェック日付を日別にカウント
  const dateCountMap = new Map<string, number>();
  const yearPrefix = String(year);

  for (const [, checkedAt] of checkLog) {
    if (!checkedAt.startsWith(yearPrefix)) continue;
    dateCountMap.set(checkedAt, (dateCountMap.get(checkedAt) ?? 0) + 1);
  }

  // 月別グリッド生成
  const months: MonthData[] = [];

  for (let m = 0; m < 12; m++) {
    const numDays = daysInMonth(year, m);
    const startDow = mondayIndex(new Date(year, m, 1));

    const days: DayCell[] = [];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const count = dateCountMap.get(dateKey) ?? 0;
      days.push({ day: d, count, level: countToLevel(count) });
    }

    months.push({ name: MONTH_NAMES[m], startDow, days });
  }

  // 統計
  const activeDays = [...dateCountMap.values()].filter((c) => c > 0).length;
  const totalChecks = [...dateCountMap.values()].reduce((a, b) => a + b, 0);
  const sortedDates = [...dateCountMap.keys()]
    .filter((d) => (dateCountMap.get(d) ?? 0) > 0)
    .sort();
  const maxStreak = longestConsecutiveStreak(sortedDates);

  return {
    year,
    months,
    activeDays,
    maxStreak,
    totalChecks,
  };
}

export function emptyHeatmap(year: number): HeatmapData {
  return computeHeatmap(new Map(), year);
}
