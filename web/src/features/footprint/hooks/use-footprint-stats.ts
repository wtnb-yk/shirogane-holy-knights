import { useMemo, useSyncExternalStore } from 'react';
import {
  subscribeCheckLog,
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
} from '@/features/streams/lib/check-log';
import { computeHeatmap, type HeatmapData } from '../lib/compute-heatmap';

/**
 * チェック日付ログからヒートマップデータを算出するフック
 *
 * check-log の変更を購読し、リアクティブに再計算する。
 */
export function useFootprintStats(year: number): HeatmapData {
  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );

  return useMemo(() => computeHeatmap(checkLog, year), [checkLog, year]);
}
