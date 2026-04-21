import { useMemo, useSyncExternalStore } from 'react';
import type { Stream } from '@/lib/data/types';
import {
  subscribeChecked,
  getCheckedSnapshot,
  getCheckedServerSnapshot,
} from '@/features/streams/lib/checked-streams';
import {
  subscribeCheckLog,
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
} from '@/features/streams/lib/check-log';
import {
  subscribeFavorites,
  getFavoritesSnapshot,
  getFavoritesServerSnapshot,
} from '@/features/music/lib/favorite-songs';
import { computeStats, type ReportStats } from '../lib/compute-stats';

/**
 * チェック済み配信 + チェック日付ログ + お気に入り楽曲から統計を算出するフック
 *
 * checked-streams / check-log / favorite-songs の変更を購読し、リアクティブに再計算する。
 */
export function useReportStats(streams: Stream[]): ReportStats {
  const checkedIds = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );

  const favoriteIds = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );

  return useMemo(
    () => computeStats(streams, checkedIds, checkLog, favoriteIds.size),
    [streams, checkedIds, checkLog, favoriteIds],
  );
}
