import type { ReactNode } from 'react';
import { CategoryTabs } from '@/components/ui/category-tabs';
import type { SourceTab } from '../hooks/use-music-filter';

type Props = {
  activeTab: SourceTab;
  counts: { utawaku: number; live: number; mv: number };
  onSelectTab: (tab: SourceTab) => void;
  toolbarRight: ReactNode;
};

const TABS: {
  key: SourceTab;
  label: string;
  countKey: keyof Props['counts'];
}[] = [
  { key: 'utawaku', label: '歌枠', countKey: 'utawaku' },
  { key: 'live', label: 'ライブ', countKey: 'live' },
  { key: 'mv', label: 'MV', countKey: 'mv' },
];

export function SourceTabs({
  activeTab,
  counts,
  onSelectTab,
  toolbarRight,
}: Props) {
  const tabs = TABS.map((t) => ({
    key: t.key,
    label: t.label,
    count: counts[t.countKey],
  }));

  return (
    <div className="flex items-stretch justify-between border-b border-border mb-lg">
      <CategoryTabs
        tabs={tabs}
        activeKey={activeTab}
        onSelect={(key) => onSelectTab((key as SourceTab) ?? 'utawaku')}
        showAll={false}
      />
      <div className="flex items-center gap-0.5">{toolbarRight}</div>
    </div>
  );
}
