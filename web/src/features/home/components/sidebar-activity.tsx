'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
  subscribeCheckLog,
} from '@/features/streams/lib/check-log';
import { computeWeeklyStats } from '../lib/compute-weekly-stats';
import { computeHeatmapCompact } from '../lib/compute-heatmap-compact';
import { HeatmapCompact } from './heatmap-compact';
import { SidebarActivityEmpty } from './sidebar-activity-empty';

export function SidebarActivity() {
  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );

  const weekly = computeWeeklyStats(checkLog);
  const heatmap = computeHeatmapCompact(checkLog);

  if (heatmap.activeDays === 0) {
    return <SidebarActivityEmpty />;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-lg transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wide text-accent-label uppercase mb-sm">
        My Activity
      </div>

      {/* 統計 */}
      <div className="flex gap-lg mb-md">
        <div>
          <div className="font-display text-xl font-semibold text-heading leading-none">
            {weekly.thisWeek}
            <span className="text-xs font-normal text-subtle ml-0.5">本</span>
          </div>
          <div className="font-mono text-3xs text-subtle mt-0.5">今週</div>
          {weekly.delta !== 0 && (
            <div
              className={`font-mono text-xs ${
                weekly.delta > 0 ? 'text-[var(--color-success)]' : 'text-subtle'
              }`}
            >
              {weekly.delta > 0 ? '↑' : '↓'} {weekly.delta > 0 ? '+' : ''}
              {weekly.delta}
            </div>
          )}
        </div>
        <div>
          <div className="font-display text-xl font-semibold text-heading leading-none">
            {heatmap.activeDays}
            <span className="text-xs font-normal text-subtle ml-0.5">日</span>
          </div>
          <div className="font-mono text-3xs text-subtle mt-0.5">記録日数</div>
        </div>
        <div>
          <div className="font-display text-xl font-semibold text-heading leading-none">
            {heatmap.maxStreak}
            <span className="text-xs font-normal text-subtle ml-0.5">日</span>
          </div>
          <div className="font-mono text-3xs text-subtle mt-0.5">最長連続</div>
        </div>
      </div>

      {/* ヒートマップ */}
      <HeatmapCompact data={heatmap} />

      {/* アクションリンク */}
      <div className="flex gap-sm mt-md">
        <Link
          href="/report"
          className="inline-flex items-center gap-xs px-md py-1.5 bg-[var(--glow-navy)] border border-border rounded-sm text-xs font-medium text-interactive transition-all duration-200 ease-out-expo hover:bg-heading hover:text-surface hover:border-heading"
        >
          &#9997; レポートを作る
        </Link>
        <Link
          href="/footprint"
          className="inline-flex items-center gap-xs px-md py-1.5 bg-[var(--glow-navy)] border border-border rounded-sm text-xs font-medium text-interactive transition-all duration-200 ease-out-expo hover:bg-heading hover:text-surface hover:border-heading"
        >
          &#128200; あしあとを見る
        </Link>
      </div>
    </div>
  );
}
