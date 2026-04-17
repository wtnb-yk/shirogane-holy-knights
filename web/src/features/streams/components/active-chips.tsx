import type { ActiveFilter } from '../hooks/use-stream-filter';

type Props = {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
};

export function ActiveChips({ filters, onRemove }: Props) {
  if (filters.length === 0) return null;

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-sm">
      <div className="flex gap-xs flex-wrap items-center">
        <span className="font-mono text-3xs text-subtle mr-0.5">
          絞り込み中
        </span>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onRemove(f.key)}
            className="inline-flex items-center gap-2xs py-2xs pl-2.5 pr-2 font-body text-3xs font-medium text-accent-label bg-[var(--glow-gold)] border border-accent rounded-full cursor-pointer whitespace-nowrap transition-all duration-250 ease-out-expo hover:bg-accent/10 hover:border-accent"
          >
            {f.label}
            <svg
              className="w-2.5 h-2.5 opacity-60"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
