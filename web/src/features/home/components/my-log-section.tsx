'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  getCheckLogSnapshot,
  getCheckLogServerSnapshot,
  subscribeCheckLog,
} from '@/features/streams/lib/check-log';
import { RevealStagger } from '@/components/ui/reveal';
import { HomeSectionHeader } from './home-section-header';
import { computeWeeklyStats } from '../lib/compute-weekly-stats';
import { computeHeatmapCompact } from '../lib/compute-heatmap-compact';
import { HeatmapCompact } from './heatmap-compact';
import { MyLogEmpty } from './my-log-empty';

export function MyLogSection() {
  const checkLog = useSyncExternalStore(
    subscribeCheckLog,
    getCheckLogSnapshot,
    getCheckLogServerSnapshot,
  );

  const weekly = computeWeeklyStats(checkLog);
  const heatmap = computeHeatmapCompact(checkLog);
  const isEmpty = heatmap.activeDays === 0;

  return (
    <section className="max-w-[var(--content-max)] mx-auto px-md md:px-lg">
      <HomeSectionHeader
        num="02"
        label="My Log"
        title="あなたの視聴記録"
        description="視聴チェックした配信が積み重なり、あなただけの推し活ログになります。"
      />

      {isEmpty ? (
        <MyLogEmpty />
      ) : (
        <RevealStagger className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-md">
          {/* This Week カード */}
          <div className="bg-surface border border-border rounded-lg p-md md:p-lg flex flex-col justify-center hover:border-border-hover hover:shadow-card-hover transition-all duration-300 ease-out-expo">
            <div className="font-mono text-xs font-medium text-subtle tracking-wide uppercase mb-sm">
              This Week
            </div>
            <div className="font-display text-3xl font-semibold text-heading leading-none">
              {weekly.thisWeek}
              <span className="text-base font-normal text-muted ml-xs">
                本視聴
              </span>
            </div>
            {weekly.delta !== 0 && (
              <div
                className={`font-mono text-xs mt-xs ${
                  weekly.delta > 0
                    ? 'text-[var(--color-success)]'
                    : 'text-subtle'
                }`}
              >
                {weekly.delta > 0 ? '↑' : '↓'} 先週比{' '}
                {weekly.delta > 0 ? '+' : ''}
                {weekly.delta}
              </div>
            )}
          </div>

          {/* あしあとカード */}
          <div className="bg-surface border border-border rounded-lg p-md md:p-lg hover:border-border-hover hover:shadow-card-hover transition-all duration-300 ease-out-expo">
            <div className="flex items-baseline justify-between mb-md">
              <div>
                <div className="font-display text-base font-semibold text-heading">
                  あしあと
                </div>
                <div className="text-xs text-muted mt-0.5 leading-[1.5]">
                  視聴した日に色がつきます
                </div>
              </div>
              <Link
                href="/footprint"
                className="text-xs text-subtle transition-colors duration-200 hover:text-foreground"
              >
                フル表示 &rarr;
              </Link>
            </div>

            <div className="flex gap-xl mb-md">
              <div>
                <div className="font-display text-xl font-semibold text-heading leading-none">
                  {heatmap.activeDays}
                  <span className="text-sm font-normal text-muted ml-0.5">
                    日
                  </span>
                </div>
                <div className="font-mono text-2xs text-subtle mt-xs tracking-wide">
                  記録あり / 過去6ヶ月
                </div>
              </div>
              <div>
                <div className="font-display text-xl font-semibold text-heading leading-none">
                  {heatmap.maxStreak}
                  <span className="text-sm font-normal text-muted ml-0.5">
                    日
                  </span>
                </div>
                <div className="font-mono text-2xs text-subtle mt-xs tracking-wide">
                  最長連続記録
                </div>
              </div>
            </div>

            <HeatmapCompact data={heatmap} />
          </div>
        </RevealStagger>
      )}
    </section>
  );
}
