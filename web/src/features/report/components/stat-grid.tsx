type StatItem = {
  label: string;
  value: number;
  unit: string;
};

type Props = {
  items: StatItem[];
};

export function StatGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-[6px]">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[var(--rc-cell-bg)] border border-[var(--rc-cell-border)] rounded-lg px-3 py-2.5"
        >
          <div className="font-mono text-[8px] text-[var(--rc-cell-label)] tracking-[0.04em]">
            {item.label}
          </div>
          <div className="font-display text-lg font-bold text-[var(--rc-cell-val)] leading-tight mt-0.5">
            <span className="text-[var(--rc-accent)]">{item.value}</span>
            <span className="font-body text-[0.65rem] font-normal text-[var(--rc-cell-label)] ml-0.5">
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
