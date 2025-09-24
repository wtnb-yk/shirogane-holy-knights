'use client';

import React from 'react';
import { SearchResultsSummary } from '@/components/common/SearchResultsSummary';

interface CalendarSearchResultsSummaryProps {
  searchQuery: string;
  totalCount: number;
  onClearAllFilters: () => void;
  hasFilters: boolean;
  selectedEventTypeNames: string[];
}

export const CalendarSearchResultsSummary = ({
  searchQuery,
  totalCount,
  onClearAllFilters,
  hasFilters,
  selectedEventTypeNames
}: CalendarSearchResultsSummaryProps) => {

  const filterSummary = selectedEventTypeNames.length > 0
    ? `カテゴリ: ${selectedEventTypeNames.join(', ')}`
    : undefined;

  return (
    <SearchResultsSummary
      searchQuery={searchQuery}
      filterSummary={filterSummary}
      totalCount={totalCount}
      onClearAllFilters={onClearAllFilters}
      hasFilters={hasFilters}
      filters={{
        selectedTags: selectedEventTypeNames,
      }}
    />
  );
};