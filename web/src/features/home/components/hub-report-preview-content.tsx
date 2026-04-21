import Link from 'next/link';
import type { GenreShare } from '@/features/report/lib/compute-stats';

type Props = {
  genres: GenreShare[];
  coverageRate: number;
  weeklyAverage: number;
  maxStreak: number;
  favoriteSongCount: number;
};

const DONUT_COLORS = [
  'var(--color-gold-400)',
  'var(--color-navy-400)',
  'var(--color-navy-200)',
  'var(--color-gold-300)',
  'var(--color-cream-300)',
];

export function HubReportPreviewContent({
  genres,
  coverageRate,
  weeklyAverage,
  maxStreak,
  favoriteSongCount,
}: Props) {
  return (
    <div
      className="rounded-lg border border-border p-lg flex flex-col transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card"
      style={{
        background:
          'linear-gradient(165deg, var(--color-surface) 0%, #f3f0e6 100%)',
      }}
    >
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-2xs">
        Activity Report
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-md">
        団員レポート
      </h2>

      <DonutChart genres={genres} />

      <div className="grid grid-cols-2 gap-sm mb-md">
        <StatCell value={`${coverageRate}`} unit="%" label="配信カバー率" />
        <StatCell
          value={`${weeklyAverage}`}
          unit="本/週"
          label="週あたり平均"
        />
        <StatCell value={`${maxStreak}`} unit="日" label="連続視聴記録" />
        <StatCell
          value={`${favoriteSongCount}`}
          unit="曲"
          label="お気に入り楽曲"
        />
      </div>

      <Link
        href="/report"
        className="mt-auto text-center py-sm rounded-sm text-xs font-semibold bg-heading text-surface transition-all duration-200 ease-out-expo hover:bg-[var(--color-navy-900)] hover:-translate-y-px"
      >
        レポートを作る
      </Link>
    </div>
  );
}

function DonutChart({ genres }: { genres: GenreShare[] }) {
  const total = genres.reduce((s, g) => s + g.count, 0);
  if (total === 0) return null;

  const percentages = genres.map((g) => (g.count / total) * 100);
  const stops = genres.map((_, i) => {
    const start = percentages.slice(0, i).reduce((a, b) => a + b, 0);
    const end = start + percentages[i];
    return `${DONUT_COLORS[i] ?? DONUT_COLORS[4]} ${start}% ${end}%`;
  });

  return (
    <div className="flex items-center gap-md mb-lg">
      <div
        className="w-[90px] h-[90px] rounded-full relative flex-shrink-0"
        style={{ background: `conic-gradient(${stops.join(',')})` }}
      >
        <div className="absolute inset-[18px] rounded-full bg-surface" />
      </div>
      <div className="flex flex-col gap-xs flex-1">
        {genres.map((g, i) => (
          <div
            key={g.name}
            className="flex items-center gap-xs text-2xs text-foreground"
          >
            <span
              className="w-sm h-sm rounded-2xs flex-shrink-0"
              style={{ background: DONUT_COLORS[i] ?? DONUT_COLORS[4] }}
            />
            {g.name} {Math.round((g.count / total) * 100)}%
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCell({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="p-sm bg-page rounded-sm">
      <div className="font-display text-lg font-semibold text-heading leading-none">
        {value}
        <span className="text-3xs font-normal text-subtle">{unit}</span>
      </div>
      <div className="font-mono text-[9px] text-subtle mt-2xs">{label}</div>
    </div>
  );
}
