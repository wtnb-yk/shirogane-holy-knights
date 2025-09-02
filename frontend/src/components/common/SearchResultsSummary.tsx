'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface SearchResultsSummaryProps {
  searchQuery: string;
  filterSummary?: string;
  totalCount: number;
  onClearAllFilters: () => void;
  hasFilters: boolean;
}

export const SearchResultsSummary = ({
  searchQuery,
  filterSummary,
  totalCount,
  onClearAllFilters,
  hasFilters
}: SearchResultsSummaryProps) => {
  const shouldShow = searchQuery.trim() || hasFilters;
  
  if (!shouldShow) return null;

  return (
    <div className="mb-6 py-3 px-4 bg-amber-50 border border-amber-200 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-800">
            {searchQuery && `「${searchQuery}」`}
            {searchQuery && filterSummary && ' / '}
            {filterSummary}
            {(searchQuery || filterSummary) && 'の'}検索結果: <span className="font-semibold">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        <button
          onClick={onClearAllFilters}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-amber-700 hover:text-amber-900 bg-white border border-amber-300 hover:border-amber-400 rounded-md transition-all duration-300"
        >
          <X className="w-4 h-4" />
          クリア
        </button>
      </div>
    </div>
  );
};