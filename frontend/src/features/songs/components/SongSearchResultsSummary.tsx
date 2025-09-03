import React from 'react';
import { X, Calendar, TrendingUp, Search } from 'lucide-react';
import { SongFilterOptions, SearchTarget, SingFrequencyCategory } from '../types/types';

interface SongSearchResultsSummaryProps {
  searchQuery: string;
  searchTarget?: SearchTarget;
  totalCount: number;
  filters: SongFilterOptions;
  onClearSearch: () => void;
  onClearAllFilters: () => void;
  onClearDateFilters?: () => void;
  onClearFrequencyFilters?: () => void;
}

const FREQUENCY_LABELS = {
  [SingFrequencyCategory.LOW]: '1-2回',
  [SingFrequencyCategory.MEDIUM]: '3-5回',
  [SingFrequencyCategory.HIGH]: '6-10回',
  [SingFrequencyCategory.VERY_HIGH]: '11回以上'
};

const SEARCH_TARGET_LABELS = {
  [SearchTarget.ALL]: '楽曲名・アーティスト名',
  [SearchTarget.TITLE]: '楽曲名のみ',
  [SearchTarget.ARTIST]: 'アーティスト名のみ'
};

export function SongSearchResultsSummary({
  searchQuery,
  searchTarget = SearchTarget.ALL,
  totalCount,
  filters,
  onClearSearch,
  onClearAllFilters,
  onClearDateFilters,
  onClearFrequencyFilters
}: SongSearchResultsSummaryProps) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasDateFilters = !!(filters.startDate || filters.endDate);
  const hasFrequencyFilters = !!(filters.frequencyCategories && filters.frequencyCategories.length > 0);
  const hasAnyFilters = hasSearchQuery || hasDateFilters || hasFrequencyFilters;
  
  if (!hasAnyFilters) {
    return null;
  }

  const getSearchTargetDisplay = () => {
    if (!hasSearchQuery || searchTarget === SearchTarget.ALL) return null;
    return SEARCH_TARGET_LABELS[searchTarget];
  };

  return (
    <div className="mb-6 py-3 px-4 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex flex-col gap-3">
        {/* 検索結果サマリー */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">
            検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
          
          <button
            onClick={onClearAllFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
          >
            <X className="w-3 h-3" />
            すべてクリア
          </button>
        </div>
        
        {/* アクティブフィルター表示 */}
        <div className="flex flex-wrap gap-2">
          {hasSearchQuery && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white border border-accent-gold/30 rounded text-xs">
                <Search className="w-3 h-3 text-accent-gold" />
                <span className="text-text-primary font-medium">「{searchQuery}」</span>
                {getSearchTargetDisplay() && (
                  <span className="text-text-tertiary">({getSearchTargetDisplay()})</span>
                )}
              </div>
              <button
                onClick={onClearSearch}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {hasDateFilters && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white border border-surface-border rounded text-xs">
                <Calendar className="w-3 h-3 text-text-secondary" />
                <span className="text-text-primary">
                  {filters.startDate && filters.endDate && `${filters.startDate} ～ ${filters.endDate}`}
                  {filters.startDate && !filters.endDate && `${filters.startDate} 以降`}
                  {!filters.startDate && filters.endDate && `${filters.endDate} 以前`}
                </span>
              </div>
              {onClearDateFilters && (
                <button
                  onClick={onClearDateFilters}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          
          {hasFrequencyFilters && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white border border-surface-border rounded text-xs">
                <TrendingUp className="w-3 h-3 text-text-secondary" />
                <span className="text-text-primary">
                  {filters.frequencyCategories!.map(cat => FREQUENCY_LABELS[cat]).join(', ')}
                </span>
              </div>
              {onClearFrequencyFilters && (
                <button
                  onClick={onClearFrequencyFilters}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
