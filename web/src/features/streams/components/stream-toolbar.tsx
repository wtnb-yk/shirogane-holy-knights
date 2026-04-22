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
  const [panelOpen, setPanelOpen] = useState(false);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  // CategoryTabs 用: activeTags が quickTag 1つだけなら、そのタグ名を activeKey にする
  const activeTabKey =
    activeTags.size === 1
      ? (quickTags.find((t) => activeTags.has(t.id))?.name ?? null)
      : null;

  const tabs = quickTags.map((t) => ({ key: t.name, label: t.name }));

  // CategoryTabs の onSelect → タグ名から ID に変換して selectTag を呼ぶ
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

  const mobileActions = (openSearch: () => void) => (
    <div className="flex items-center gap-2xs shrink-0">
      <ToolbarIconButton title="検索" onClick={openSearch}>
        {searchIcon}
      </ToolbarIconButton>
      <ToolbarIconButton
        title="絞り込み"
        badge={filterBadgeCount}
        onClick={() => setPanelOpen((o) => !o)}
      >
        {filterIcon}
      </ToolbarIconButton>
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
                <ChipSelect label={activeTabKey ?? 'すべて'}>
                  {(close) => (
                    <div className="py-xs">
                      <button
                        onClick={() => {
                          onSelectTag(null);
                          close();
                        }}
                        className={`w-full text-left px-md py-sm font-body text-xs cursor-pointer transition-colors duration-150 ${
                          activeTags.size === 0
                            ? 'text-heading font-semibold bg-surface-hover'
                            : 'text-foreground hover:bg-surface-hover'
                        }`}
                      >
                        すべて
                      </button>
                      {quickTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => {
                            onSelectTag(tag.id);
                            close();
                          }}
                          className={`w-full text-left px-md py-sm font-body text-xs cursor-pointer transition-colors duration-150 ${
                            activeTags.has(tag.id)
                              ? 'text-heading font-semibold bg-surface-hover'
                              : 'text-foreground hover:bg-surface-hover'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </ChipSelect>
                {mobileActions(openSearch)}
              </div>

              {/* デスクトップ */}
              <div className="hidden md:flex items-stretch justify-between">
                <CategoryTabs
                  tabs={tabs}
                  activeKey={activeTabKey}
                  onSelect={handleTabSelect}
                />
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
                    <FilterPanel
                      open={panelOpen}
                      onClose={closePanel}
                      onClearAll={onClearAll}
                    >
                      <StreamFilterContent
                        allTags={allTags}
                        activeTags={activeTags}
                        checkFilter={checkFilter}
                        onToggleTag={onToggleTag}
                        onCheckFilter={onCheckFilter}
                      />
                    </FilterPanel>
                  </div>
                  <ToolbarIconButton title="並び替え" onClick={onToggleSort}>
                    {sortIcon}
                  </ToolbarIconButton>
                  <span className="font-mono text-3xs text-subtle whitespace-nowrap px-xs">
                    {filteredCount.toLocaleString()}件
                  </span>
                </div>
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
            allTags={allTags}
            activeTags={activeTags}
            checkFilter={checkFilter}
            onToggleTag={onToggleTag}
            onCheckFilter={onCheckFilter}
          />
        </BottomSheet>
      </div>
    </div>
  );
}
