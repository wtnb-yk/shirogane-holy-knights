'use client';

import React from 'react';
import { SearchResultsSummary } from '@/components/Stats/SearchResultsSummary';
import { getEventTypeLabel } from '@/features/calendar/utils/eventTypeUtils';
import { EventType } from '@/features/calendar/types';

interface CalendarSearchResultsSummaryProps {
  searchQuery: string;
  totalCount: number;
  onClearAllFilters: () => void;
  hasFilters: boolean;
  selectedEventTypes: EventType[];
}

export const CalendarSearchResultsSummary = ({
  searchQuery,
  totalCount,
  onClearAllFilters,
  hasFilters,
  selectedEventTypes
}: CalendarSearchResultsSummaryProps) => {

  const selectedEventTypeNames = selectedEventTypes.map(type => getEventTypeLabel(type.type));

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