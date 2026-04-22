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

/** ReportStats + theme をクエリパラメータ文字列にエンコード */
export function encodeShareParams(
  stats: ReportStats,
  theme: ReportTheme,
): string {
  const params = new URLSearchParams();
  params.set('sc', String(stats.streamCount));
  params.set('cr', String(stats.coverageRate));
  params.set('wa', String(stats.weeklyAverage));
  params.set('ms', String(stats.maxStreak));
  params.set('fs', String(stats.favoriteSongCount));

  if (stats.genreDistribution.length > 0) {
    params.set(
      'g',
      stats.genreDistribution.map((g) => `${g.name}:${g.count}`).join(','),
    );
  }

  params.set('t', THEME_KEY[theme]);
  return params.toString();
}

/** クエリパラメータから ShareData をデコード。不正な場合は null */
export function decodeShareParams(
  params: Record<string, string | string[] | undefined>,
): ShareData | null {
  const sc = Number(params.sc);
  const cr = Number(params.cr);
  if (!sc || Number.isNaN(sc) || Number.isNaN(cr)) return null;

  const wa = Number(params.wa) || 0;
  const ms = Number(params.ms) || 0;
  const fs = Number(params.fs) || 0;

  const gStr = typeof params.g === 'string' ? params.g : '';
  const genres: GenreShare[] = gStr
    ? gStr.split(',').map((pair) => {
        const [name, countStr] = pair.split(':');
        return { name: name || '', count: Number(countStr) || 0 };
      })
    : [];

  const tKey = typeof params.t === 'string' ? params.t : 'l';
  const theme = THEME_MAP[tKey] ?? 'light';

  return {
    streamCount: sc,
    coverageRate: cr,
    weeklyAverage: wa,
    maxStreak: ms,
    favoriteSongCount: fs,
    genres,
    theme,
  };
}
