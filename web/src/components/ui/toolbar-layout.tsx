'use client';

import type { ReactNode } from 'react';
import { CategoryTabs } from '@/components/ui/category-tabs';
import { ChipSelect } from '@/components/ui/chip-select';
import { ToolbarSearch } from '@/components/ui/toolbar-search';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import { SearchIcon } from '@/components/icons/toolbar-icons';

type Tab = {
  key: string;
  label: string;
  count?: number;
};

type Props = {
  tabs: Tab[];
  activeKey: string | null;
  onSelectTab: (key: string | null) => void;
  showAllTab?: boolean;
  allLabel?: string;
  search: string;
  onSearch: (q: string) => void;
  searchPlaceholder?: string;
  /** ツールバー右側のアクション要素（フィルタボタン、ソートボタン等） */
  actions?: ReactNode;
};

export function ToolbarLayout({
  tabs,
  activeKey,
  onSelectTab,
  showAllTab = true,
  allLabel,
  search,
  onSearch,
  searchPlaceholder = '検索...',
  actions,
}: Props) {
  const activeLabel =
    tabs.find((t) => t.key === activeKey)?.label ?? (allLabel || 'すべて');

  return (
    <ToolbarSearch
      value={search}
      onChange={onSearch}
      placeholder={searchPlaceholder}
    >
      {(openSearch, inlineInput) => (
        <>
          {/* モバイル */}
          <div className="flex items-center justify-between md:hidden py-xs">
            <ChipSelect label={activeLabel}>
              {(close) => (
                <div className="py-xs">
                  {showAllTab && (
                    <DropdownItem
                      label={allLabel || 'すべて'}
                      isActive={activeKey === null}
                      onClick={() => {
                        onSelectTab(null);
                        close();
                      }}
                    />
                  )}
                  {tabs.map((tab) => (
                    <DropdownItem
                      key={tab.key}
                      label={tab.label}
                      count={tab.count}
                      isActive={activeKey === tab.key}
                      onClick={() => {
                        onSelectTab(tab.key);
                        close();
                      }}
                    />
                  ))}
                </div>
              )}
            </ChipSelect>
            <div className="flex items-center gap-2xs shrink-0">
              <ToolbarIconButton title="検索" onClick={openSearch}>
                <SearchIcon />
              </ToolbarIconButton>
              {actions}
            </div>
          </div>

          {/* デスクトップ */}
          <div className="hidden md:flex items-stretch justify-between">
            <CategoryTabs
              tabs={tabs}
              activeKey={activeKey}
              onSelect={onSelectTab}
              showAll={showAllTab}
              allLabel={allLabel}
            />
            <div className="flex items-center gap-2xs shrink-0">
              {inlineInput ?? (
                <ToolbarIconButton title="検索" onClick={openSearch}>
                  <SearchIcon />
                </ToolbarIconButton>
              )}
              {actions}
            </div>
          </div>
        </>
      )}
    </ToolbarSearch>
  );
}

function DropdownItem({
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
      className={`w-full flex items-center justify-between px-md py-sm font-body text-xs cursor-pointer transition-colors duration-150 ${
        isActive
          ? 'text-heading font-semibold bg-surface-hover'
          : 'text-foreground hover:bg-surface-hover'
      }`}
    >
      <span>{label}</span>
      {count != null && (
        <span
          className={`font-mono text-3xs ${isActive ? 'text-muted' : 'text-subtle'}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
