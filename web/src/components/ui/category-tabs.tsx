type TabItem = {
  key: string;
  label: string;
  count?: number;
};

type Props = {
  tabs: TabItem[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
  allLabel?: string;
  showAll?: boolean;
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
  activeKey,
  onSelect,
  allLabel = 'すべて',
  showAll = true,
}: Props) {
  return (
    <nav className="flex">
      {showAll && (
        <Tab
          label={allLabel}
          isActive={activeKey === null}
          onClick={() => onSelect(null)}
        />
      )}
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          label={tab.label}
          count={tab.count}
          isActive={activeKey === tab.key}
          onClick={() => onSelect(activeKey === tab.key ? null : tab.key)}
        />
      ))}
    </nav>
  );
}
