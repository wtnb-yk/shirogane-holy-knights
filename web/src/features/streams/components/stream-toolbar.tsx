'use client';

import { useCallback, useState } from 'react';
import type { StreamTagWithCount } from '@/lib/data/types';
import { CategoryTabs } from '@/components/ui/category-tabs';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ChipSelect } from '@/components/ui/chip-select';
import { ToolbarSearch } from '@/components/ui/toolbar-search';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import { FilterPanel } from '@/components/ui/filter-panel';
import type { SortOrder, CheckFilter } from '../hooks/use-stream-filter';
import { StreamFilterContent } from './stream-filter-content';

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

  const searchIcon = (
    <svg
      className="w-4 h-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  );

  const filterIcon = (
    <svg
      className="w-4 h-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 4h12M4 8h8M6 12h4" />
    </svg>
  );

  const sortIcon = (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ease-out-expo ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 2v8M3 7l3 3 3-3" />
    </svg>
  );

  const actionButtons = (
    openSearch: () => void,
    inlineInput: React.ReactNode | null = null,
  ) => (
    <div className="flex items-center gap-2xs shrink-0">
      {inlineInput ?? (
        <ToolbarIconButton title="検索" onClick={openSearch}>
          {searchIcon}
        </ToolbarIconButton>
      )}
      <div className="relative">
        <ToolbarIconButton
          title="絞り込み"
          badge={filterBadgeCount}
          onClick={() => setPanelOpen((o) => !o)}
        >
          {filterIcon}
        </ToolbarIconButton>
        <div className="hidden md:block">
          <FilterPanel
            open={panelOpen}
            onClose={closePanel}
            onClearAll={onClearAll}
          >
            <StreamFilterContent
              panelTags={panelTags}
              activePanelTags={activePanelTags}
              checkFilter={checkFilter}
              onTogglePanelTag={onTogglePanelTag}
              onCheckFilter={onCheckFilter}
            />
          </FilterPanel>
        </div>
      </div>
      <ToolbarIconButton title="並び替え" onClick={onToggleSort}>
        {sortIcon}
      </ToolbarIconButton>
      <span className="font-mono text-3xs text-subtle whitespace-nowrap px-xs">
        {filteredCount.toLocaleString()}件
      </span>
    </div>
  );

  return (
    <div className="sticky top-[var(--header-height)] z-50 bg-surface border-b border-border">
      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg">
        <ToolbarSearch
          value={search}
          onChange={onSearch}
          placeholder="配信を検索..."
        >
          {(openSearch, inlineInput) => (
            <>
              {/* モバイル */}
              <div className="flex items-center justify-between md:hidden py-xs">
                <ChipSelect label={activeCategory ?? 'すべて'}>
                  {(close) => (
                    <div className="py-xs">
                      {[
                        { key: null, label: 'すべて' },
                        ...categoryTabs.map((t) => ({
                          key: t.name,
                          label: t.name,
                        })),
                      ].map((opt) => (
                        <button
                          key={opt.key ?? '__all__'}
                          onClick={() => {
                            onSelectCategory(opt.key);
                            close();
                          }}
                          className={`w-full text-left px-md py-sm font-body text-xs cursor-pointer transition-colors duration-150 ${
                            activeCategory === opt.key
                              ? 'text-heading font-semibold bg-surface-hover'
                              : 'text-foreground hover:bg-surface-hover'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </ChipSelect>
                {actionButtons(openSearch)}
              </div>

              {/* デスクトップ */}
              <div className="hidden md:flex items-stretch justify-between">
                <CategoryTabs
                  tabs={tabs}
                  activeKey={activeCategory}
                  onSelect={onSelectCategory}
                />
                {actionButtons(openSearch, inlineInput)}
              </div>
            </>
          )}
        </ToolbarSearch>
      </div>

      {/* モバイル: フィルターボトムシート */}
      <div className="md:hidden">
        <BottomSheet
          open={panelOpen}
          onClose={closePanel}
          title="絞り込み"
          headerRight={
            <button
              onClick={onClearAll}
              className="font-body text-xs text-muted hover:text-heading cursor-pointer transition-colors duration-250 ease-out-expo"
            >
              すべて解除
            </button>
          }
        >
          <StreamFilterContent
            panelTags={panelTags}
            activePanelTags={activePanelTags}
            checkFilter={checkFilter}
            onTogglePanelTag={onTogglePanelTag}
            onCheckFilter={onCheckFilter}
          />
        </BottomSheet>
      </div>
    </div>
  );
}
