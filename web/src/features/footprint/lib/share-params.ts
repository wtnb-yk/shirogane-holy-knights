import type { HeatmapData } from './compute-heatmap';

/** OGP画像生成に必要な最小限のデータ */
export type FootprintShareData = {
  year: number;
  activeDays: number;
  maxStreak: number;
  totalChecks: number;
};

/** HeatmapData をクエリパラメータ文字列にエンコード */
export function encodeFootprintParams(data: HeatmapData): string {
  const params = new URLSearchParams();
  params.set('yr', String(data.year));
  params.set('ad', String(data.activeDays));
  params.set('ms', String(data.maxStreak));
  params.set('tc', String(data.totalChecks));
  return params.toString();
}

/** クエリパラメータから FootprintShareData をデコード。不正な場合は null */
export function decodeFootprintParams(
  params: Record<string, string | string[] | undefined>,
): FootprintShareData | null {
  const yr = Number(params.yr);
  const ad = Number(params.ad);
  if (!yr || Number.isNaN(yr) || Number.isNaN(ad)) return null;

  return {
    year: yr,
    activeDays: ad,
    maxStreak: Number(params.ms) || 0,
    totalChecks: Number(params.tc) || 0,
  };
}
