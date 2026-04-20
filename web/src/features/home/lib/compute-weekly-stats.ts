export type WeeklyStats = {
  thisWeek: number;
  lastWeek: number;
  delta: number;
};

/** 月曜始まりで、指定日が属する週の月曜 00:00 を返す */
function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = (d.getDay() + 6) % 7; // 0=月, 6=日
  d.setDate(d.getDate() - dow);
  return d;
}

/**
 * check-log から今週・先週の視聴本数を算出する。
 *
 * checkLog: Map<videoId, checkedAt(YYYY-MM-DD)>
 * 「今週」「先週」は checkedAt（チェックした日）基準。
 */
export function computeWeeklyStats(checkLog: Map<string, string>): WeeklyStats {
  const now = new Date();
  const thisMonday = startOfWeek(now);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);

  let thisWeek = 0;
  let lastWeek = 0;

  for (const [, checkedAt] of checkLog) {
    const d = new Date(checkedAt + 'T00:00:00');
    if (d >= thisMonday) {
      thisWeek++;
    } else if (d >= lastMonday) {
      lastWeek++;
    }
  }

  return { thisWeek, lastWeek, delta: thisWeek - lastWeek };
}
