'use client';

import React from 'react';
import { FilterOptions } from '../filter/FilterBar';

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
  const hasFilters = filters.selectedTags.length > 0 || filters.startDate || filters.endDate;
  const shouldShow = searchQuery || hasFilters;

  if (!shouldShow) return null;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-sage-200">
      <div className="flex items-center justify-between">
        <div className="text-sage-300">
          {searchQuery && (
            <span>
              「<span className="font-medium text-gray-800">{searchQuery}</span>」
            </span>
          )}
          {hasFilters && (
            <span className={searchQuery ? 'ml-2' : ''}>
              {searchQuery ? 'とフィルター' : 'フィルター'}による検索結果
            </span>
          )}
          {totalCount > 0 && <span className="ml-2">({totalCount}件)</span>}
        </div>
        <button
          onClick={onClearAllFilters}
          className="text-sm text-sage-300 hover:text-gray-600 transition-colors"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
};