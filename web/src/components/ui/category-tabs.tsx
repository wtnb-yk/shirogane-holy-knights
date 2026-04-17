type TabItem = {
  key: string;
  label: string;
};

type Props = {
  tabs: TabItem[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
  allLabel?: string;
};

function Tab({
  label,
  isActive,
  onClick,
}: {
  label: string;
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
}: Props) {
  return (
    <nav className="flex">
      <Tab
        label={allLabel}
        isActive={activeKey === null}
        onClick={() => onSelect(null)}
      />
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          label={tab.label}
          isActive={activeKey === tab.key}
          onClick={() => onSelect(activeKey === tab.key ? null : tab.key)}
        />
      ))}
    </nav>
  );
}
