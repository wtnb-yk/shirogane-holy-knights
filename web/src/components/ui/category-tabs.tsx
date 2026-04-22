type TabItem = {
  id: number;
  label: string;
  count?: number;
};

type Props = {
  tabs: TabItem[];
  activeIds: Set<number>;
  onToggle: (id: number) => void;
  onClearAll: () => void;
  allLabel?: string;
};

function Tab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-md py-3 font-body text-xs font-medium whitespace-nowrap cursor-pointer transition-colors duration-250 ease-out-expo ${
        isActive
          ? 'text-heading font-semibold'
          : 'text-muted hover:text-heading'
      }`}
    >
      {label}
      {count != null && (
        <span className="font-mono text-3xs text-subtle ml-1">{count}</span>
      )}
      {isActive && (
        <span className="absolute bottom-0 left-sm right-sm h-0.5 bg-accent rounded-t-[1px]" />
      )}
    </button>
  );
}

export function CategoryTabs({
  tabs,
  activeIds,
  onToggle,
  onClearAll,
  allLabel = 'すべて',
}: Props) {
  return (
    <nav className="flex">
      <Tab
        label={allLabel}
        isActive={activeIds.size === 0}
        onClick={onClearAll}
      />
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          count={tab.count}
          isActive={activeIds.has(tab.id)}
          onClick={() => onToggle(tab.id)}
        />
      ))}
    </nav>
  );
}
