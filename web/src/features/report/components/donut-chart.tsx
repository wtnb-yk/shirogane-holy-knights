import type { GenreShare } from '../lib/compute-stats';

const COLORS = ['#C8A24C', '#6A7380', '#ACB1B8', '#D4B56A', '#E2E2E6'];
const R = 38;
const CX = 60;
const CY = 60;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = {
  genres: GenreShare[];
  streamCount: number;
};

export function DonutChart({ genres, streamCount }: Props) {
  const total = genres.reduce((s, g) => s + g.count, 0);
  if (total === 0) return null;

  const offsets = genres.reduce<number[]>(
    (acc, g) => {
      const prev = acc[acc.length - 1];
      return [...acc, prev + CIRCUMFERENCE * (g.count / total)];
    },
    [CIRCUMFERENCE * 0.25],
  );

  const segments = genres.map((g, i) => (
    <circle
      key={g.name}
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke={COLORS[i % COLORS.length]}
      strokeWidth={12}
      strokeDasharray={`${CIRCUMFERENCE * (g.count / total)} ${CIRCUMFERENCE * (1 - g.count / total)}`}
      strokeDashoffset={-offsets[i]}
    />
  ));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="w-[140px] h-[140px]">
        {segments}
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          className="font-display text-[26px] font-extrabold"
          fill="var(--rc-donut-text)"
        >
          {streamCount}
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          className="font-body text-[9px]"
          fill="var(--rc-donut-sub)"
        >
          本
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-[10px] gap-y-[3px] mt-2">
        {genres.map((g, i) => (
          <div
            key={g.name}
            className="flex items-center gap-1 font-mono text-[8px] text-[var(--rc-legend)]"
          >
            <span
              className="w-[7px] h-[7px] rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {g.name} {g.count}
          </div>
        ))}
      </div>
    </div>
  );
}
