import { forwardRef } from 'react';
import type { HeatmapData } from '../lib/compute-heatmap';
import { HeatmapGrid } from './heatmap-grid';

type Props = {
  data: HeatmapData;
};

export const FootprintCard = forwardRef<HTMLDivElement, Props>(
  function FootprintCard({ data }, ref) {
    return (
      <div
        ref={ref}
        data-hm-theme="light"
        className="w-[420px] max-w-full rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(26,35,53,0.06),0_16px_48px_rgba(26,35,53,0.10)] animate-card-entrance"
      >
        <div
          className="hm-card-inner relative px-lg pt-[28px] pb-[20px] max-md:px-md max-md:pt-lg max-md:pb-[18px] border border-[var(--hm-border)]"
          style={{ background: 'var(--hm-bg)' }}
        >
          {/* ヘッダー */}
          <div className="flex items-baseline gap-sm mb-md">
            <span className="font-display text-2xl font-bold text-[var(--hm-year)] leading-none">
              {data.year}
            </span>
            <span className="font-body text-sm font-medium text-[var(--hm-title)]">
              あしあと
            </span>
          </div>

          {/* ヒートマップ */}
          <HeatmapGrid months={data.months} />

          {/* 統計 */}
          <div className="flex gap-xl max-md:gap-lg max-md:flex-wrap mt-xl pt-lg border-t border-[var(--hm-divider)]">
            <StatItem value={data.activeDays} unit="日" label="視聴あり" />
            <StatItem value={data.maxStreak} unit="日" label="最長連続記録" />
            <StatItem value={data.totalChecks} unit="本" label="視聴本数" />
          </div>

          {/* フッター */}
          <div className="text-center mt-lg pt-md border-t border-[var(--hm-divider)]">
            <span className="font-mono text-[9px] text-[var(--hm-footer)] tracking-[0.08em]">
              だんいんログ &mdash; 白銀ノエル非公式ファンサイト
            </span>
          </div>
        </div>
      </div>
    );
  },
);

function StatItem({
  value,
  unit,
  label,
}: {
  value: number;
  unit: string;
  label: string;
}) {
  return (
    <div>
      <div className="font-display text-xl font-bold text-[var(--hm-stat-num)] leading-none">
        <span className="text-[var(--hm-stat-accent)]">{value}</span>
        <small className="text-sm font-normal text-[var(--hm-stat-unit)] ml-[2px]">
          {unit}
        </small>
      </div>
      <div className="font-mono text-3xs text-[var(--hm-stat-label)] mt-1 tracking-[0.04em]">
        {label}
      </div>
    </div>
  );
}
