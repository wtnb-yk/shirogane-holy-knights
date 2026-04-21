'use client';

import { useSyncExternalStore } from 'react';
import type { Stream } from '@/lib/data/types';
import {
  getCheckedSnapshot,
  getCheckedServerSnapshot,
  subscribeChecked,
} from '@/features/streams/lib/checked-streams';
import {
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
  subscribeCheckLog,
} from '@/features/streams/lib/check-log';
import {
  getFavoritesSnapshot,
  getFavoritesServerSnapshot,
  subscribeFavorites,
} from '@/features/music/lib/favorite-songs';
import { computeStats } from '@/features/report/lib/compute-stats';
import { HubReportPreviewContent } from './hub-report-preview-content';
import { HubReportPreviewEmpty } from './hub-report-preview-empty';

type Props = {
  allStreams: Stream[];
};

export function HubReportPreview({ allStreams }: Props) {
  const checked = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );
  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );

  const stats = computeStats(allStreams, checked, checkLog, favorites.size);

  if (stats.streamCount === 0) {
    return <HubReportPreviewEmpty />;
  }

  return (
    <HubReportPreviewContent
      genres={stats.genreDistribution}
      coverageRate={stats.coverageRate}
      weeklyAverage={stats.weeklyAverage}
      maxStreak={stats.maxStreak}
      favoriteSongCount={stats.favoriteSongCount}
    />
  );
}
