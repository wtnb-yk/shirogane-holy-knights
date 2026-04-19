'use client';

import type { ReactNode } from 'react';
import { CategoryTabs } from '@/components/ui/category-tabs';
import { ChipSelect } from '@/components/ui/chip-select';
import { ToolbarSearch } from '@/components/ui/toolbar-search';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import type { SourceTab } from '../hooks/use-music-filter';

type Props = {
  activeTab: SourceTab;
  counts: { utawaku: number; live: number; mv: number };
  onSelectTab: (tab: SourceTab) => void;
  search: string;
  onSearch: (q: string) => void;
  toolbarRight: ReactNode;
};

const TABS: {
  key: SourceTab;
  label: string;
  countKey: keyof Props['counts'];
}[] = [
  { key: 'utawaku', label: '歌枠', countKey: 'utawaku' },
  { key: 'live', label: 'ライブ', countKey: 'live' },
  { key: 'mv', label: 'MV・歌ってみた', countKey: 'mv' },
];

export function SourceTabs({
  activeTab,
  counts,
  onSelectTab,
  search,
  onSearch,
  toolbarRight,
}: Props) {
  const tabs = TABS.map((t) => ({
    key: t.key,
    label: t.label,
    count: counts[t.countKey],
  }));

  const activeLabel = TABS.find((t) => t.key === activeTab)?.label ?? '歌枠';

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

  return (
    <div className="border-b border-border mb-lg">
      <ToolbarSearch
        value={search}
        onChange={onSearch}
        placeholder="曲名・アーティスト..."
      >
        {(openSearch, inlineInput) => (
          <>
            {/* モバイル */}
            <div className="flex items-center justify-between md:hidden py-xs px-sm">
              <ChipSelect label={activeLabel}>
                {(close) => (
                  <div className="py-xs">
                    {TABS.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          onSelectTab(t.key);
                          close();
                        }}
                        className={`w-full flex items-center justify-between px-md py-sm font-body text-xs cursor-pointer transition-colors duration-150 ${
                          activeTab === t.key
                            ? 'text-heading font-semibold bg-surface-hover'
                            : 'text-foreground hover:bg-surface-hover'
                        }`}
                      >
                        <span>{t.label}</span>
                        <span
                          className={`font-mono text-3xs ${activeTab === t.key ? 'text-muted' : 'text-subtle'}`}
                        >
                          {counts[t.countKey]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </ChipSelect>
              <div className="flex items-center gap-2xs">
                <ToolbarIconButton title="検索" onClick={openSearch}>
                  {searchIcon}
                </ToolbarIconButton>
                {toolbarRight}
              </div>
            </div>

            {/* デスクトップ */}
            <div className="hidden md:flex items-stretch justify-between">
              <CategoryTabs
                tabs={tabs}
                activeKey={activeTab}
                onSelect={(key) => onSelectTab((key as SourceTab) ?? 'utawaku')}
                showAll={false}
              />
              <div className="flex items-center gap-2xs">
                {inlineInput ?? (
                  <ToolbarIconButton title="検索" onClick={openSearch}>
                    {searchIcon}
                  </ToolbarIconButton>
                )}
                {toolbarRight}
              </div>
            </div>
          </>
        )}
      </ToolbarSearch>
    </div>
  );
}
