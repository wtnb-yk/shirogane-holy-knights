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
    <div className="mb-6 p-4 bg-shirogane-bg-accent/30 border border-shirogane-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">
            {searchQuery && `「${searchQuery}」`}
            {searchQuery && filterSummary && ' / '}
            {filterSummary}
            {(searchQuery || filterSummary) && 'の'}検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        <button
          onClick={onClearAllFilters}
          className="flex items-center gap-1 px-3 py-1 text-xs text-shirogane-text-secondary hover:text-gray-800 bg-white border border-shirogane-surface-border rounded-md hover:bg-shirogane-bg-accent transition-all duration-200"
        >
          <X className="w-3 h-3" />
          クリア
        </button>
      </div>
    </div>
  );
};