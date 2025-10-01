'use client';

import React from 'react';
import { SearchInput } from '@/components/Input/SearchInput';
import { SearchOptionsButton } from '@/components/Button/SearchOptionsButton';

interface DiscographySearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick?: () => void;
  hasActiveOptions?: boolean;
  title?: string;
}

export const DiscographySearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions = false,
  title = 'アルバム検索',
}: DiscographySearchSectionProps) => {
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
        placeholder="アルバム・アーティストを探す"
        variant="sidebar"
        size="sm"
        className="mb-3"
      />

      {onOptionsClick && (
        <SearchOptionsButton
          onClick={onOptionsClick}
          hasActiveOptions={hasActiveOptions}
        />
      )}
    </div>
  );
};