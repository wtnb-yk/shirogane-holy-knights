'use client';

import React from 'react';
import { SearchInput } from '@/components/Input/SearchInput';
import { SearchOptionsButton } from '@/components/Button/SearchOptionsButton';

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

      <SearchOptionsButton
        onClick={onFilterClick}
        hasActiveOptions={hasActiveOptions}
      />
    </div>
  );
};
