'use client';

import { useSyncExternalStore } from 'react';
import {
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
  subscribeCheckLog,
} from '@/features/streams/lib/check-log';
import { computeHeatmapCompact } from '../lib/compute-heatmap-compact';
import { HubFootprintContent } from './hub-footprint-content';
import { HubFootprintEmpty } from './hub-footprint-empty';

export function HubFootprint() {
  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );

  const heatmap = computeHeatmapCompact(checkLog);

  if (heatmap.activeDays === 0) {
    return <HubFootprintEmpty />;
  }

  return (
    <HubFootprintContent
      activeDays={heatmap.activeDays}
      maxStreak={heatmap.maxStreak}
      cells={heatmap.cells}
    />
  );
}
