import { useMemo, useSyncExternalStore } from 'react';
import type { Stream } from '@/lib/data/types';
import {
  subscribeChecked,
  getCheckedSnapshot,
  getCheckedServerSnapshot,
} from '@/features/streams/lib/checked-streams';
import { computeHeatmap, type HeatmapData } from '../lib/compute-heatmap';

/**
 * チェック済み配信からヒートマップデータを算出するフック
 *
 * checked-streams の変更を購読し、リアクティブに再計算する。
 */
export function useFootprintStats(
  streams: Stream[],
  year: number,
): HeatmapData {
  const checkedIds = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  return useMemo(
    () => computeHeatmap(streams, checkedIds, year),
    [streams, checkedIds, year],
  );
}
