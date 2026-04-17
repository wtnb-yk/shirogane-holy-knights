type Props = {
  checked: number;
  total: number;
};

export function ProgressBar({ checked, total }: Props) {
  return (
    <div className="flex items-center gap-sm">
      <span className="font-display text-lg font-semibold text-heading leading-none">
        {checked.toLocaleString()}
      </span>
      <span className="font-mono text-xs text-subtle">
        / {total.toLocaleString()} チェック済
      </span>
      <div className="w-20 h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-gold-300))] rounded-full transition-[width] duration-500 ease-out-expo"
          style={{ width: `${(checked / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
