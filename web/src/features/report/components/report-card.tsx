import { forwardRef } from 'react';
import type { ReportStats } from '../lib/compute-stats';
import { DonutChart } from './donut-chart';
import { YearlyChart } from './yearly-chart';
import { StatGrid } from './stat-grid';

export type ReportTheme = 'light' | 'dark' | 'gold';

type Props = {
  stats: ReportStats;
  theme: ReportTheme;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="font-mono text-[8px] font-medium tracking-[0.12em] text-[var(--rc-sub)] uppercase mb-2">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--rc-divider)] my-1" />;
}

export const ReportCard = forwardRef<HTMLDivElement, Props>(function ReportCard(
  { stats, theme },
  ref,
) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  return (
    <div
      ref={ref}
      data-report-theme={theme}
      className="w-[420px] max-w-full rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(26,35,53,0.06),0_16px_48px_rgba(26,35,53,0.10)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(26,35,53,0.08),0_24px_64px_rgba(26,35,53,0.14)] animate-card-entrance"
    >
      <div
        className="rc-inner relative px-6 pt-7 pb-5 max-md:px-[18px] max-md:pt-[22px] max-md:pb-[18px] border border-[var(--rc-border)]"
        style={{ background: 'var(--rc-bg)' }}
      >
        {/* ヘッダー */}
        <div className="text-center mb-3.5">
          <div className="text-base text-[var(--rc-icon)] mb-1">&#9876;</div>
          <div className="font-mono text-[9px] font-medium tracking-[0.18em] text-[var(--rc-mono-label)] uppercase">
            Activity Report
          </div>
          <div className="w-7 h-[1.5px] bg-[var(--rc-line)] mx-auto my-2 rounded-[1px]" />
          <div className="font-body text-base font-bold text-[var(--rc-heading)] tracking-[0.04em] leading-snug">
            白銀聖騎士団
            <br />
            団員レポート
          </div>
        </div>

        {/* ジャンル構成 */}
        <div className="py-[10px]">
          <SectionTitle>Genre</SectionTitle>
          <DonutChart
            genres={stats.genreDistribution}
            streamCount={stats.streamCount}
          />
        </div>

        <Divider />

        {/* 年別カバー率 */}
        <div className="py-3">
          <SectionTitle>Yearly Coverage</SectionTitle>
          <YearlyChart coverage={stats.yearlyCoverage} />
        </div>

        <Divider />

        {/* 統計グリッド */}
        <div className="py-3">
          <SectionTitle>Your Stats</SectionTitle>
          <StatGrid
            items={[
              { label: '配信カバー率', value: stats.coverageRate, unit: '%' },
              {
                label: '週あたり平均',
                value: stats.weeklyAverage,
                unit: '本/週',
              },
              { label: '連続視聴記録', value: stats.maxStreak, unit: '日' },
              {
                label: 'お気に入り楽曲',
                value: stats.favoriteSongCount,
                unit: '曲',
              },
            ]}
          />
        </div>

        {/* フッター */}
        <div className="text-center mt-3 pt-3 border-t border-[var(--rc-footer-border)]">
          <div className="font-mono text-[8px] text-[var(--rc-footer-text)] tracking-[0.08em]">
            だんいんログ &mdash; 白銀ノエル非公式ファンサイト
          </div>
          <div className="font-mono text-[8px] text-[var(--rc-footer-date)] mt-0.5">
            Generated {today}
          </div>
        </div>
      </div>
    </div>
  );
});
