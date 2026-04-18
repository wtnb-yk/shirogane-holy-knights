/** ISO日付文字列を YYYY.MM.DD 形式に変換 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

/** HH:MM:SS → 1h30m / 30m（人間向けコンパクト表記） */
export function formatDuration(dur: string): string {
  const parts = dur.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m] = parts;
    if (h > 0) return `${h}h${String(m).padStart(2, '0')}m`;
    return `${m}m`;
  }
  return dur;
}

/** HH:MM:SS → 1:30:00 / 30:00（タイムスタンプ表記） */
export function formatDurationTimestamp(dur: string): string {
  const parts = dur.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (h > 0)
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return dur;
}

/** 秒数 → 1:30:00 / 3:45（楽曲タイムスタンプ表記） */
export function formatTime(seconds: number): string {
  if (seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
