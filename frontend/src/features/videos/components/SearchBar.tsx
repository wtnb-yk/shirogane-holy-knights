'use client';

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterButton } from './search/FilterButton';

interface SearchBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  disabled?: boolean;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
}

export const SearchBar = ({ 
  searchValue = '', 
  onSearchChange, 
  onFilterClick, 
  disabled = false,
  onSearch,
  onClearSearch
}: SearchBarProps) => {
  return (
    <div className="mb-8 flex flex-wrap gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <SearchInput
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        disabled={disabled}
        placeholder="タイトルで検索..."
      />
      <FilterButton
        onFilterClick={onFilterClick}
        disabled={disabled}
      />
    </div>
  );
};