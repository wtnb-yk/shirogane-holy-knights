import { useMemo, useSyncExternalStore } from 'react';
import type { Stream } from '@/lib/data/types';
import {
  subscribeChecked,
  getCheckedSnapshot,
  getCheckedServerSnapshot,
} from '@/features/streams/lib/checked-streams';
import { computeStats, type ReportStats } from '../lib/compute-stats';

/**
 * チェック済み配信から統計を算出するフック
 *
 * checked-streams の変更を購読し、リアクティブに再計算する。
 */
export function useReportStats(streams: Stream[]): ReportStats {
  const checkedIds = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  return useMemo(
    () => computeStats(streams, checkedIds),
    [streams, checkedIds],
  );
}
