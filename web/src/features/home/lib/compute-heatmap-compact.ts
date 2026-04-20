export type CompactCell = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3;
};

export type CompactHeatmap = {
  cells: CompactCell[];
  monthLabels: { name: string; colStart: number }[];
  activeDays: number;
  maxStreak: number;
};

const WEEKS = 26;
const CELLS = WEEKS * 7; // 182

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

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * check-log から過去 26 週間のフラットヒートマップを構築する。
 *
 * グリッドは列=週、行=曜日（月曜始まり）。
 * セルは左上（最も古い月曜）から右下（今日を含む週の日曜）へ並ぶ。
 */
export function computeHeatmapCompact(
  checkLog: Map<string, string>,
): CompactHeatmap {
  // 日付別カウント
  const dateCountMap = new Map<string, number>();
  for (const [, checkedAt] of checkLog) {
    dateCountMap.set(checkedAt, (dateCountMap.get(checkedAt) ?? 0) + 1);
  }

  // 起点: 今日から 25 週前の月曜
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (today.getDay() + 6) % 7; // 0=月, 6=日
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - dow);

  const startDate = new Date(thisMonday);
  startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7);

  // セル生成（列順: week0→week25、行順: 月→日）
  const cells: CompactCell[] = [];
  for (let i = 0; i < CELLS; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = toDateKey(d);
    const count = dateCountMap.get(key) ?? 0;
    cells.push({ date: key, count, level: countToLevel(count) });
  }

  // 月ラベル: 各月の初日が属する列番号を計算
  const monthLabels: { name: string; colStart: number }[] = [];
  let lastMonth = -1;

  for (let col = 0; col < WEEKS; col++) {
    // 各列の月曜日の日付
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + col * 7);
    const month = d.getMonth();

    if (month !== lastMonth) {
      monthLabels.push({ name: MONTH_NAMES[month], colStart: col });
      lastMonth = month;
    }
  }

  // 統計（範囲内のみ）
  const rangeStart = toDateKey(startDate);
  const rangeEnd = toDateKey(today);
  const activeDates = [...dateCountMap.keys()]
    .filter((d) => d >= rangeStart && d <= rangeEnd && dateCountMap.get(d)! > 0)
    .sort();
  const activeDays = activeDates.length;
  const maxStreak = longestConsecutiveStreak(activeDates);

  return { cells, monthLabels, activeDays, maxStreak };
}
