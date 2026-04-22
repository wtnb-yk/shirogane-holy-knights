'use client';

import { useCallback } from 'react';
import type { StreamTagWithCount } from '@/lib/data/types';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import { ToolbarLayout } from '@/components/ui/toolbar-layout';
import { SortIcon } from '@/components/icons/toolbar-icons';
import type { SortOrder, CheckFilter } from '../hooks/use-stream-filter';
import { StreamFilterOverlay } from './stream-filter-overlay';

type Props = {
  quickTags: StreamTagWithCount[];
  allTags: StreamTagWithCount[];
  activeTags: Set<number>;
  search: string;
  sortOrder: SortOrder;
  checkFilter: CheckFilter;
  filteredCount: number;
  filterBadgeCount: number;
  onSelectTag: (id: number | null) => void;
  onToggleTag: (id: number) => void;
  onSearch: (q: string) => void;
  onToggleSort: () => void;
  onCheckFilter: (f: CheckFilter) => void;
  onClearAll: () => void;
};

export function StreamToolbar({
  quickTags,
  allTags,
  activeTags,
  search,
  sortOrder,
  checkFilter,
  filteredCount,
  filterBadgeCount,
  onSelectTag,
  onToggleTag,
  onSearch,
  onToggleSort,
  onCheckFilter,
  onClearAll,
}: Props) {
  const activeTabKey =
    activeTags.size === 1
      ? (quickTags.find((t) => activeTags.has(t.id))?.name ?? null)
      : null;

  const tabs = quickTags.map((t) => ({ key: t.name, label: t.name }));

  const handleTabSelect = useCallback(
    (key: string | null) => {
      if (key === null) {
        onSelectTag(null);
      } else {
        const tag = quickTags.find((t) => t.name === key);
        if (tag) onSelectTag(tag.id);
      }
    },
    [quickTags, onSelectTag],
  );

  return (
    <div className="sticky top-[var(--header-height)] z-50 bg-surface border-b border-border">
      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg">
        <ToolbarLayout
          tabs={tabs}
          activeKey={activeTabKey}
          onSelectTab={handleTabSelect}
          search={search}
          onSearch={onSearch}
          searchPlaceholder="配信を検索..."
          actions={
            <>
              <StreamFilterOverlay
                allTags={allTags}
                activeTags={activeTags}
                checkFilter={checkFilter}
                badgeCount={filterBadgeCount}
                onToggleTag={onToggleTag}
                onCheckFilter={onCheckFilter}
                onClearAll={onClearAll}
              />
              <ToolbarIconButton title="並び替え" onClick={onToggleSort}>
                <SortIcon
                  className={`w-3 h-3 transition-transform duration-200 ease-out-expo ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
                />
              </ToolbarIconButton>
              <span className="font-mono text-3xs text-subtle whitespace-nowrap px-xs">
                {filteredCount.toLocaleString()}件
              </span>
            </>
          }
        />
      </div>
    </div>
  );
}
