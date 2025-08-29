import React from 'react';
import { X, Calendar } from 'lucide-react';
import { SongFilterOptions } from '../types/types';

interface SongSearchResultsSummaryProps {
  searchQuery: string;
  totalCount: number;
  filters: SongFilterOptions;
  onClearSearch: () => void;
  onClearAllFilters: () => void;
}

export function SongSearchResultsSummary({
  searchQuery,
  totalCount,
  filters,
  onClearSearch,
  onClearAllFilters
}: SongSearchResultsSummaryProps) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasDateFilters = !!(filters.startDate || filters.endDate);
  const hasAnyFilters = hasSearchQuery || hasDateFilters;
  
  if (!hasAnyFilters) {
    return null;
  }

  const parts = [];
  if (hasSearchQuery) parts.push(`「${searchQuery}」`);
  if (hasDateFilters) {
    if (filters.startDate && filters.endDate) {
      parts.push(`${filters.startDate} ～ ${filters.endDate}`);
    } else if (filters.startDate) {
      parts.push(`${filters.startDate} 以降`);
    } else if (filters.endDate) {
      parts.push(`${filters.endDate} 以前`);
    }
  }

  return (
    <div className="mb-6 py-2 px-3 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-text-primary">
            {parts.join(' / ')}{parts.length > 0 && 'の'}検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
          
          {hasDateFilters && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar className="w-3 h-3" />
              歌唱日フィルター適用中
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {hasSearchQuery && (
            <button
              onClick={onClearSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
            >
              <X className="w-3 h-3" />
              検索クリア
            </button>
          )}
          
          {hasAnyFilters && (
            <button
              onClick={onClearAllFilters}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
            >
              <X className="w-3 h-3" />
              すべてクリア
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
