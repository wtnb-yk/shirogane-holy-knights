'use client';

import React from 'react';
import { SearchResultsSummary as BaseSearchResultsSummary } from '@/components/common/SearchResultsSummary';
import { FilterOptions } from '../filter/ArchiveFilterSection';

interface SearchResultsSummaryProps {
  searchQuery: string;
  filters: FilterOptions;
  totalCount: number;
  onClearAllFilters: () => void;
}

export const SearchResultsSummary = ({
  searchQuery,
  filters,
  totalCount,
  onClearAllFilters
}: SearchResultsSummaryProps) => {
  const hasFilters = filters.selectedTags.length > 0 || Boolean(filters.startDate) || Boolean(filters.endDate);
  
  // フィルターサマリーの生成
  const filterParts: string[] = [];
  if (filters.selectedTags.length > 0) {
    filterParts.push(`タグ: ${filters.selectedTags.join(', ')}`);
  }
  if (filters.startDate || filters.endDate) {
    const dateRange = [];
    if (filters.startDate) dateRange.push(filters.startDate);
    if (filters.startDate && filters.endDate) dateRange.push('〜');
    if (filters.endDate) dateRange.push(filters.endDate);
    filterParts.push(`期間: ${dateRange.join(' ')}`);
  }
  const filterSummary = filterParts.join(' / ');

  return (
    <BaseSearchResultsSummary
      searchQuery={searchQuery}
      filterSummary={filterSummary}
      totalCount={totalCount}
      onClearAllFilters={onClearAllFilters}
      hasFilters={hasFilters}
      filters={{
        selectedTags: filters.selectedTags,
        startDate: filters.startDate,
        endDate: filters.endDate,
      }}
    />
  );
};
