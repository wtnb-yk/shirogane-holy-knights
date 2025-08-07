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
    <div className="mb-6 p-4 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-primary">
            {searchQuery && `「${searchQuery}」`}
            {searchQuery && filterSummary && ' / '}
            {filterSummary}
            {(searchQuery || filterSummary) && 'の'}検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        <button
          onClick={onClearAllFilters}
          className="flex items-center gap-1 px-3 py-1 text-xs text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
        >
          <X className="w-3 h-3" />
          クリア
        </button>
      </div>
    </div>
  );
};