'use client';

import React from 'react';
import { SearchInput } from '@/components/Input/SearchInput';
import { SearchOptionsButton } from '@/components/Button/SearchOptionsButton';

interface NewsSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick?: () => void;
  hasActiveOptions?: boolean;
  title?: string;
}

export const NewsSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions = false,
  title = 'ニュース検索',
}: NewsSearchSectionProps) => {
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
        placeholder="気になるニュースを探す"
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