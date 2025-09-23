'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';

interface ArchiveSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onFilterClick: () => void;
  hasActiveOptions: boolean;
  title?: string;
}

export const ArchiveSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  onFilterClick,
  hasActiveOptions,
  title = 'アーカイブ検索',
}: ArchiveSearchSectionProps) => {
  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <SearchInput
        searchValue={searchValue}
        onSearchChange={(value) => {
          if (!value) {
            onClearSearch();
          }
        }}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        placeholder="キーワードを入力"
        variant="sidebar"
        size="sm"
        className="mb-3"
      />
      
      <button
        onClick={onFilterClick}
        className={`w-full py-2.5 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
          hasActiveOptions
            ? 'border-text-secondary text-text-secondary bg-text-secondary/10 hover:bg-text-secondary/20'
            : 'border-surface-border text-text-secondary bg-white hover:text-text-primary hover:border-text-secondary hover:bg-bg-accent/20'
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>検索オプション</span>
        {hasActiveOptions && (
          <span className="ml-1 w-2 h-2 bg-text-secondary rounded-full"></span>
        )}
      </button>
    </div>
  );
};
