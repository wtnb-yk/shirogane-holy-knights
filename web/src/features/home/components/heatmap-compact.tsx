'use client';

import type { CompactHeatmap } from '../lib/compute-heatmap-compact';

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-[var(--hm-cell-l0)]',
  1: 'bg-[var(--hm-cell-l1)]',
  2: 'bg-[var(--hm-cell-l2)]',
  3: 'bg-[var(--hm-cell-l3)]',
};

type Props = {
  data: CompactHeatmap;
};

export function HeatmapCompact({ data }: Props) {
  const { cells, monthLabels } = data;

  return (
    <div data-hm-theme="light">
      {/* 月ラベル */}
      <div
        className="grid font-mono text-3xs text-subtle mb-xs"
        style={{ gridTemplateColumns: `repeat(26, 1fr)` }}
      >
        {monthLabels.map(({ name, colStart }) => (
          <span
            key={`${name}-${colStart}`}
            style={{ gridColumn: colStart + 1 }}
          >
            {name}
          </span>
        ))}
      </div>

      {/* セルグリッド: 26列 × 7行 */}
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(26, 1fr)` }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[2px] transition-transform duration-150 ease-out hover:scale-[1.4] hover:z-10 hover:relative ${LEVEL_CLASSES[cell.level]}`}
            title={cell.count > 0 ? `${cell.date}: ${cell.count}本` : undefined}
          />
        ))}
      </div>
    </div>
  );
}
