type ToggleOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: ToggleOption<T>[];
  activeKey: T;
  onSelect: (key: T) => void;
};

export function StateToggle<T extends string>({
  options,
  activeKey,
  onSelect,
}: Props<T>) {
  return (
    <div className="inline-flex gap-0 p-[3px] bg-surface-hover rounded-sm">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onSelect(opt.key)}
          className={`px-3.5 py-1 font-mono text-2xs font-medium border-none rounded-[4px] cursor-pointer transition-all duration-250 ease-out-expo ${
            activeKey === opt.key
              ? 'bg-surface text-heading shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              : 'bg-transparent text-muted'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
