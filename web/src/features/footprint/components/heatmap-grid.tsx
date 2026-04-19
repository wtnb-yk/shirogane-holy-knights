import type { HeatmapCell, MonthLabel } from '../lib/compute-heatmap';

type Props = {
  cells: HeatmapCell[];
  months: MonthLabel[];
  totalColumns: number;
};

const DAY_LABELS = [
  { label: '月', visible: true },
  { label: '火', visible: false },
  { label: '水', visible: true },
  { label: '木', visible: false },
  { label: '金', visible: true },
  { label: '土', visible: false },
  { label: '日', visible: false },
];

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-[var(--hm-cell-l0)]',
  1: 'bg-[var(--hm-cell-l1)]',
  2: 'bg-[var(--hm-cell-l2)]',
  3: 'bg-[var(--hm-cell-l3)]',
};

export function HeatmapGrid({ cells, months, totalColumns }: Props) {
  return (
    <>
      <div className="overflow-x-auto pb-sm [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--hm-divider)]">
        <div className="flex gap-[6px] min-w-[680px]">
          {/* 曜日ラベル */}
          <div className="flex flex-col gap-[2px] pt-[18px]">
            {DAY_LABELS.map((d) => (
              <div
                key={d.label}
                className="h-3 leading-3 font-mono text-[9px] text-[var(--hm-label)] text-right pr-1"
                style={{ visibility: d.visible ? 'visible' : 'hidden' }}
              >
                {d.label}
              </div>
            ))}
          </div>

          {/* グリッドエリア */}
          <div className="flex-1">
            {/* 月ラベル */}
            <div
              className="grid mb-1 pl-px"
              style={{
                gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
              }}
            >
              {months.map((m) => (
                <span
                  key={m.name}
                  className="font-mono text-[9px] text-[var(--hm-label)]"
                  style={{ gridColumn: `span ${m.span}` }}
                >
                  {m.name}
                </span>
              ))}
            </div>

            {/* セルグリッド */}
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
                gridTemplateRows: 'repeat(7, 1fr)',
                gridAutoFlow: 'column',
              }}
            >
              {cells.map((cell) => (
                <div
                  key={cell.date}
                  className={`w-3 h-3 rounded-[2px] transition-transform duration-150 ease-linear hover:scale-[1.6] hover:z-[1] hover:relative ${LEVEL_CLASSES[cell.level]}`}
                  title={`${cell.date}: ${cell.count}本`}
                />
              ))}
            </div>
          </div>
        </div>
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
