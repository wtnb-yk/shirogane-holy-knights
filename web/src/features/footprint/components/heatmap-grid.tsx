import type { MonthData, DayCell } from '../lib/compute-heatmap';

type Props = {
  months: MonthData[];
};

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-[var(--hm-cell-l0)]',
  1: 'bg-[var(--hm-cell-l1)]',
  2: 'bg-[var(--hm-cell-l2)]',
  3: 'bg-[var(--hm-cell-l3)]',
};

function MonthBlock({ month }: { month: MonthData }) {
  return (
    <div>
      <div className="font-mono text-[9px] text-[var(--hm-label)] mb-[3px] tracking-[0.04em]">
        {month.name}
      </div>
      <div className="grid grid-cols-7 gap-[2px]">
        {/* 月初の曜日オフセット（空セル） */}
        {Array.from({ length: month.startDow }).map((_, i) => (
          <div key={`e${i}`} className="aspect-square" />
        ))}
        {/* 実際の日セル */}
        {month.days.map((cell) => (
          <Cell key={cell.day} cell={cell} />
        ))}
      </div>
    </div>
  );
}

function Cell({ cell }: { cell: DayCell }) {
  return (
    <div
      className={`aspect-square rounded-[2px] ${LEVEL_CLASSES[cell.level]}`}
      title={cell.count > 0 ? `${cell.count}本` : undefined}
    />
  );
}

export function HeatmapGrid({ months }: Props) {
  return (
    <>
      {/* 月別グリッド (4列×3行) */}
      <div className="grid grid-cols-4 gap-[10px] max-md:gap-sm">
        {months.map((m) => (
          <MonthBlock key={m.name} month={m} />
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-[6px] mt-md justify-end">
        <span className="font-mono text-[9px] text-[var(--hm-label)]">少</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--hm-cell-l0)]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--hm-cell-l1)]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--hm-cell-l2)]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--hm-cell-l3)]" />
        <span className="font-mono text-[9px] text-[var(--hm-label)]">多</span>
      </div>
    </>
  );
}
