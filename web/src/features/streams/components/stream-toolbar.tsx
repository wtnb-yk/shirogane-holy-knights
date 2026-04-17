'use client';

import { useCallback, useState } from 'react';
import type { StreamTagWithCount } from '@/lib/data/types';
import { CategoryTabs } from '@/components/ui/category-tabs';
import {
  ExpandableSearch,
  ToolbarIconButton,
} from '@/components/ui/toolbar-actions';
import {
  FilterPanel,
  FilterSection,
  FilterEmptySection,
} from '@/components/ui/filter-panel';
import { TagPill } from '@/components/ui/tag-pill';
import type { SortOrder, CheckFilter } from '../hooks/use-stream-filter';

type Props = {
  categoryTabs: StreamTagWithCount[];
  activeCategory: string | null;
  activePanelTags: Set<number>;
  search: string;
  sortOrder: SortOrder;
  checkFilter: CheckFilter;
  filteredCount: number;
  panelTags: StreamTagWithCount[];
  filterBadgeCount: number;
  onSelectCategory: (cat: string | null) => void;
  onTogglePanelTag: (id: number) => void;
  onSearch: (q: string) => void;
  onToggleSort: () => void;
  onCheckFilter: (f: CheckFilter) => void;
  onClearAll: () => void;
};

const checkOptions: { value: CheckFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'unchecked', label: '未チェック' },
  { value: 'checked', label: 'チェック済み' },
];

export function StreamToolbar({
  categoryTabs,
  activeCategory,
  activePanelTags,
  search,
  sortOrder,
  checkFilter,
  filteredCount,
  panelTags,
  filterBadgeCount,
  onSelectCategory,
  onTogglePanelTag,
  onSearch,
  onToggleSort,
  onCheckFilter,
  onClearAll,
}: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const tabs = categoryTabs.map((t) => ({ key: t.name, label: t.name }));

  return (
    <div className="sticky top-[var(--header-height)] z-50 bg-surface border-b border-border">
      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg flex items-stretch justify-between">
        <CategoryTabs
          tabs={tabs}
          activeKey={activeCategory}
          onSelect={onSelectCategory}
        />
        <div className="flex items-center gap-0.5">
          <ExpandableSearch
            value={search}
            onChange={onSearch}
            placeholder="配信を検索..."
          />
          <div className="relative">
            <ToolbarIconButton
              title="絞り込み"
              badge={filterBadgeCount}
              onClick={() => setPanelOpen((o) => !o)}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 4h12M4 8h8M6 12h4" />
              </svg>
            </ToolbarIconButton>
            <FilterPanel
              open={panelOpen}
              onClose={closePanel}
              onClearAll={onClearAll}
            >
              <div className="flex gap-1.5 px-md py-sm border-b border-border">
                {checkOptions.map((opt) => (
                  <TagPill
                    key={opt.value}
                    label={opt.label}
                    variant={opt.value === checkFilter ? 'gold' : 'filter'}
                    active={opt.value === checkFilter}
                    onClick={() => onCheckFilter(opt.value)}
                  />
                ))}
              </div>
              <FilterSection title="配信タグ">
                <div className="flex flex-wrap gap-xs">
                  {panelTags.map((tag) => (
                    <TagPill
                      key={tag.id}
                      label={tag.name}
                      active={activePanelTags.has(tag.id)}
                      onClick={() => onTogglePanelTag(tag.id)}
                    />
                  ))}
                </div>
              </FilterSection>
              <FilterEmptySection
                title="ゲームタイトル"
                placeholder="タイトルを検索..."
              />
              <FilterEmptySection
                title="コラボ相手"
                placeholder="名前を検索..."
              />
              <FilterEmptySection title="年" />
            </FilterPanel>
          </div>
          <ToolbarIconButton title="並び替え" onClick={onToggleSort}>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ease-out-expo ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2v8M3 7l3 3 3-3" />
            </svg>
          </ToolbarIconButton>
          <span className="font-mono text-3xs text-subtle whitespace-nowrap px-1 self-center">
            {filteredCount.toLocaleString()}件
          </span>
        </div>
      </div>
    </div>
  );
}
