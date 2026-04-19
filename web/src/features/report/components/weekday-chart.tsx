const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

type Props = {
  /** [日,月,火,水,木,金,土] — getDay() 順 */
  distribution: number[];
};

export function WeekdayChart({ distribution }: Props) {
  const display = [1, 2, 3, 4, 5, 6, 0].map((i) => distribution[i] ?? 0);
  const max = Math.max(...display, 1);

  return (
    <div className="flex items-end justify-center gap-[5px]">
      {display.map((count, i) => {
        const isTop = count === max && count > 0;
        const pct = max > 0 ? (count / max) * 100 : 0;
        return (
          <div
            key={DAY_LABELS[i]}
            className="flex flex-col items-center gap-[3px] flex-1 max-w-[40px]"
          >
            <span
              className={`font-display text-[8px] font-bold min-h-[12px] ${
                isTop
                  ? 'text-[var(--rc-bar-top-label)]'
                  : 'text-[var(--rc-accent)]'
              }`}
            >
              {count > 0 ? count : ''}
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
              {DAY_LABELS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
