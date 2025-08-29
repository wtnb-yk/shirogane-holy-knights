'use client';

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { SearchOptionsButton } from '@/components/ui/SearchOptionsButton';

interface SearchBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  disabled?: boolean;
  hasActiveOptions?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
}

export const SearchBar = ({ 
  searchValue = '', 
  onSearchChange, 
  onFilterClick, 
  disabled = false,
  onSearch,
  onClearSearch,
  hasActiveOptions = false
}: SearchBarProps) => {
  return (
    <div className="mb-4 md:mb-8 flex flex-wrap gap-2 md:gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <SearchInput
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        disabled={disabled}
        placeholder="お探しの動画タイトルを入力してください"
      />
      <SearchOptionsButton
        onClick={onFilterClick}
        disabled={disabled}
        hasActiveOptions={hasActiveOptions}
      />
    </div>
  );
};