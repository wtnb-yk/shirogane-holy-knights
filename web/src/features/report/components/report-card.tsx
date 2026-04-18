import { forwardRef, type ReactNode } from 'react';
import type { ReportStats } from '../lib/compute-stats';

export type ReportTheme = 'light' | 'dark' | 'gold';

type Props = {
  stats: ReportStats;
  theme: ReportTheme;
};

/* ----------------------------------------------------------------
   統計行の定義と表示
   ---------------------------------------------------------------- */

type StatDef = {
  label: string;
  format: (s: ReportStats) => ReactNode;
};

const accent = (v: ReactNode) => (
  <span className="text-[var(--rc-accent)]">{v}</span>
);

const STAT_DEFS: StatDef[] = [
  {
    label: '推し歴',
    format: (s) =>
      s.daysSinceFirst > 0 ? <>{accent(s.daysSinceFirst)} 日</> : '—',
  },
  {
    label: '総視聴時間',
    format: (s) =>
      s.totalHours > 0 ? <>約 {accent(s.totalHours)} 時間</> : '—',
  },
  {
    label: '最も視聴したジャンル',
    format: (s) =>
      s.topGenre ? (
        <>
          {s.topGenre.name} {accent(`(${s.topGenre.count})`)}
        </>
      ) : (
        '—'
      ),
  },
  {
    label: '連続視聴記録',
    format: (s) => (s.maxStreak > 0 ? <>{accent(s.maxStreak)} 日</> : '—'),
  },
  {
    label: '最近の視聴',
    format: (s) => s.lastWatchedDate || '—',
  },
  {
    label: 'お気に入りシリーズ',
    format: (s) => s.favoriteSeries ?? '—',
  },
];

function CardStatRows({ stats }: { stats: ReportStats }) {
  return (
    <div className="flex flex-col">
      {STAT_DEFS.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between py-[10px] border-b border-dashed border-[var(--rc-stat-border)] last:border-b-0"
        >
          <span className="font-mono text-3xs font-normal tracking-[0.06em] text-[var(--rc-stat-label)] shrink-0">
            {row.label}
          </span>
          <span className="font-display text-sm font-semibold text-[var(--rc-stat-value)] text-right">
            {row.format(stats)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CardFooter({ date }: { date: string }) {
  return (
    <div className="text-center mt-5 pt-4 border-t border-[var(--rc-footer-border)]">
      <div className="font-mono text-[9px] text-[var(--rc-footer-text)] tracking-[0.08em]">
        だんいんログ &mdash; 白銀ノエル非公式ファンサイト
      </div>
      <div className="font-mono text-[9px] text-[var(--rc-footer-date)] mt-0.5">
        Generated {date}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   レポートカード本体
   ---------------------------------------------------------------- */

export const ReportCard = forwardRef<HTMLDivElement, Props>(function ReportCard(
  { stats, theme },
  ref,
) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  return (
    <div
      ref={ref}
      data-report-theme={theme}
      className="w-[400px] max-w-full rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(26,35,53,0.06),0_12px_40px_rgba(26,35,53,0.08)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(26,35,53,0.08),0_20px_60px_rgba(26,35,53,0.12)] animate-card-entrance"
    >
      <div
        className="rc-inner relative px-7 pt-8 pb-6 max-md:px-5 max-md:pt-6 max-md:pb-5 border border-[var(--rc-border)]"
        style={{ background: 'var(--rc-bg)' }}
      >
        {/* ヘッダー */}
        <div className="text-center mb-lg">
          <div className="text-lg text-[var(--rc-icon)] mb-sm">&#9876;</div>
          <div className="font-mono text-3xs font-medium tracking-[0.18em] text-[var(--rc-mono-label)] uppercase">
            Activity Report
          </div>
          <div className="w-8 h-0.5 bg-[var(--rc-line)] mx-auto my-[10px] rounded-[1px]" />
          <div className="font-body text-lg font-bold text-[var(--rc-heading)] tracking-[0.04em] leading-snug">
            白銀聖騎士団
            <br />
            団員レポート
          </div>
        </div>

        {/* メイン数字 */}
        <div className="text-center py-5 mb-1">
          <div className="font-display text-[3rem] max-md:text-[2.4rem] font-bold text-[var(--rc-num)] leading-none tracking-tight">
            {stats.streamCount}
            <span className="font-body text-sm font-normal text-[var(--rc-unit)] ml-1">
              本
            </span>
          </div>
          <div className="font-mono text-3xs text-[var(--rc-featured-label)] tracking-wide mt-1.5">
            STREAMS WATCHED
          </div>
        </div>

        <CardStatRows stats={stats} />

        {/* フッター */}
        <CardFooter date={today} />
      </div>
    </div>
  );
});
