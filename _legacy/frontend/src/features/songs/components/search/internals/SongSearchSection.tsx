'use client';

import React from 'react';
import { SearchInput } from '@/components/Input/SearchInput';
import { SearchOptionsButton } from '@/components/Button/SearchOptionsButton';

interface SongSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick: () => void;
  hasActiveOptions: boolean;
  title?: string;
}

export const SongSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions,
  title = '楽曲検索',
}: SongSearchSectionProps) => {
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
        placeholder="楽曲名・アーティスト名を入力"
        variant="sidebar"
        size="sm"
        className="mb-3"
      />
      
      <SearchOptionsButton
        onClick={onOptionsClick}
        hasActiveOptions={hasActiveOptions}
      />
    </div>
  );
};
