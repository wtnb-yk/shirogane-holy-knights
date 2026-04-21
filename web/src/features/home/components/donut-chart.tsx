import type { GenreShare } from '@/features/report/lib/compute-stats';

const DONUT_COLORS = [
  'var(--color-gold-400)',
  'var(--color-navy-400)',
  'var(--color-navy-200)',
  'var(--color-gold-300)',
  'var(--color-cream-300)',
];

type Props = {
  genres: GenreShare[];
};

export function DonutChart({ genres }: Props) {
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
        className="w-[var(--donut-size)] h-[var(--donut-size)] rounded-full relative shrink-0"
        style={{ background: `conic-gradient(${stops.join(',')})` }}
      >
        <div className="absolute inset-[var(--donut-hole)] rounded-full bg-surface" />
      </div>
      <div className="flex flex-col gap-xs flex-1">
        {genres.map((g, i) => (
          <div
            key={g.name}
            className="flex items-center gap-xs text-2xs text-foreground"
          >
            <span
              className="w-sm h-sm rounded-2xs shrink-0"
              style={{ background: DONUT_COLORS[i] ?? DONUT_COLORS[4] }}
            />
            {g.name} {Math.round((g.count / total) * 100)}%
          </div>
        ))}
      </div>
    </div>
  );
}
