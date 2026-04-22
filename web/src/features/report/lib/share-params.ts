import type { ReportStats, GenreShare } from './compute-stats';
import type { ReportTheme } from '../components/report-card';

/** OGP画像生成に必要な最小限のデータ */
export type ShareData = {
  streamCount: number;
  coverageRate: number;
  weeklyAverage: number;
  maxStreak: number;
  favoriteSongCount: number;
  genres: GenreShare[];
  theme: ReportTheme;
};

const THEME_MAP: Record<string, ReportTheme> = {
  l: 'light',
  d: 'dark',
  g: 'gold',
};

const THEME_KEY: Record<ReportTheme, string> = {
  light: 'l',
  dark: 'd',
  gold: 'g',
};

/**
 * ReportStats + theme をコンパクトなクエリパラメータ文字列にエンコード
 *
 * OGP の og:image URL で `&amp;` 問題を避けるため、
 * 全データを1つの `d` パラメータに Base64 で格納する。
 */
export function encodeShareParams(
  stats: ReportStats,
  theme: ReportTheme,
): string {
  const compact = [
    stats.streamCount,
    stats.coverageRate,
    stats.weeklyAverage,
    stats.maxStreak,
    stats.favoriteSongCount,
    THEME_KEY[theme],
    ...stats.genreDistribution.map((g) => `${g.name}:${g.count}`),
  ].join(',');

  return `d=${btoa(encodeURIComponent(compact))}`;
}

/** クエリパラメータの `d` から ShareData をデコード。不正な場合は null */
export function decodeShareParams(
  params: Record<string, string | string[] | undefined>,
): ShareData | null {
  const raw = typeof params.d === 'string' ? params.d : '';
  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(atob(raw));
    const parts = decoded.split(',');
    if (parts.length < 6) return null;

    const sc = Number(parts[0]);
    if (!sc || Number.isNaN(sc)) return null;

    const theme = THEME_MAP[parts[5]] ?? 'light';

    const genres: GenreShare[] = parts.slice(6).map((pair) => {
      const idx = pair.lastIndexOf(':');
      return {
        name: pair.slice(0, idx),
        count: Number(pair.slice(idx + 1)) || 0,
      };
    });

    return {
      streamCount: sc,
      coverageRate: Number(parts[1]) || 0,
      weeklyAverage: Number(parts[2]) || 0,
      maxStreak: Number(parts[3]) || 0,
      favoriteSongCount: Number(parts[4]) || 0,
      genres,
      theme,
    };
  } catch {
    return null;
  }
}
