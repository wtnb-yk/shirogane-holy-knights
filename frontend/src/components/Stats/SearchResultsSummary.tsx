'use client';

import React from 'react';
import { X, Search, Calendar, Tag } from 'lucide-react';

export interface SearchResultsSummaryProps {
  searchQuery: string;
  filterSummary?: string;
  totalCount: number;
  onClearAllFilters: () => void;
  hasFilters: boolean;
  filters?: {
    selectedTags?: string[];
    startDate?: string;
    endDate?: string;
  };
}

export const SearchResultsSummary = ({
  searchQuery,
  totalCount,
  onClearAllFilters,
  hasFilters,
  filters
}: SearchResultsSummaryProps) => {
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasDateFilters = !!(filters?.startDate || filters?.endDate);
  const hasTagFilters = !!(filters?.selectedTags && filters.selectedTags.length > 0);
  const shouldShow = hasSearchQuery || hasFilters;
  
  if (!shouldShow) return null;

  return (
    <div className="mb-4 py-2 px-3 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex flex-col gap-2">
        {/* 検索結果サマリー */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">
            検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
          
          <button
            onClick={onClearAllFilters}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
          >
            <X className="w-3 h-3" />
            すべてクリア
          </button>
        </div>
        
        {/* アクティブフィルター表示 */}
        <div className="flex flex-wrap gap-1.5">
          {hasSearchQuery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-accent-gold/30 rounded text-xs">
              <Search className="w-3 h-3 text-accent-gold" />
              <span className="text-text-primary font-medium">「{searchQuery}」</span>
            </div>
          )}
          
          {hasTagFilters && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-surface-border rounded text-xs">
              <Tag className="w-3 h-3 text-text-secondary" />
              <span className="text-text-primary">
                {filters!.selectedTags!.join(', ')}
              </span>
            </div>
          )}
          
          {hasDateFilters && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-surface-border rounded text-xs">
              <Calendar className="w-3 h-3 text-text-secondary" />
              <span className="text-text-primary">
                {filters?.startDate && filters?.endDate && `${filters.startDate} ～ ${filters.endDate}`}
                {filters?.startDate && !filters?.endDate && `${filters.startDate} 以降`}
                {!filters?.startDate && filters?.endDate && `${filters.endDate} 以前`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
