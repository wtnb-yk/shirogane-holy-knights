import type { YearlyCoverage } from '../lib/compute-stats';

type Props = {
  coverage: YearlyCoverage[];
};

export function YearlyChart({ coverage }: Props) {
  if (coverage.length === 0) return null;

  const maxRate = Math.max(...coverage.map((c) => c.rate), 1);

  return (
    <div className="flex items-end justify-center gap-[5px]">
      {coverage.map((c) => {
        const isTop = c.rate === maxRate && c.rate > 0;
        const pct = maxRate > 0 ? (c.rate / maxRate) * 100 : 0;
        return (
          <div
            key={c.year}
            className="flex flex-col items-center gap-[3px] flex-1 max-w-[52px]"
          >
            <span
              className={`font-display text-[8px] font-bold min-h-[12px] ${
                isTop
                  ? 'text-[var(--rc-bar-top-label)]'
                  : 'text-[var(--rc-accent)]'
              }`}
            >
              {c.rate > 0 ? `${c.rate}%` : ''}
            </span>
            <div className="w-full h-[44px] rounded-[3px] bg-[var(--rc-bar-bg)] flex items-end overflow-hidden">
              <div
                className={`w-full rounded-[3px] ${
                  isTop ? 'bg-[var(--rc-bar-top)]' : 'bg-[var(--rc-bar-fill)]'
                }`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span
              className={`font-mono text-[8px] ${
                isTop
                  ? 'text-[var(--rc-bar-top-label)] font-semibold'
                  : 'text-[var(--rc-bar-label)]'
              }`}
            >
              {c.year}
            </span>
          </div>
        );
      })}
    </div>
  );
}
