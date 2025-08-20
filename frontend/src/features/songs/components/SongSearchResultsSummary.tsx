import React from 'react';
import { X } from 'lucide-react';
import { SortBy, SortOrder } from '../types/types';

interface SongSearchResultsSummaryProps {
  searchQuery: string;
  totalCount: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onClearSearch: () => void;
}

export function SongSearchResultsSummary({
  searchQuery,
  totalCount,
  sortBy,
  sortOrder,
  onClearSearch
}: SongSearchResultsSummaryProps) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  const isDefaultSort = sortBy === SortBy.SING_COUNT && sortOrder === SortOrder.DESC;
  
  if (!hasSearchQuery && isDefaultSort) {
    return null;
  }

  const getSortLabel = () => {
    const labels = {
      [`${SortBy.SING_COUNT}-${SortOrder.DESC}`]: '歌唱回数順',
      [`${SortBy.SING_COUNT}-${SortOrder.ASC}`]: '歌唱回数順（少→多）',
      [`${SortBy.LATEST_SING_DATE}-${SortOrder.DESC}`]: '最新順',
      [`${SortBy.LATEST_SING_DATE}-${SortOrder.ASC}`]: '最新順（古→新）',
      [`${SortBy.TITLE}-${SortOrder.ASC}`]: 'あいうえお順',
      [`${SortBy.TITLE}-${SortOrder.DESC}`]: 'わをん順'
    };
    return labels[`${sortBy}-${sortOrder}`] || '';
  };

  const parts = [];
  if (hasSearchQuery) parts.push(`「${searchQuery}」`);
  if (!isDefaultSort) parts.push(getSortLabel());

  return (
    <div className="mb-6 py-2 px-3 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-primary">
            {parts.join(' / ')}{parts.length > 0 && 'の'}検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        {(hasSearchQuery || !isDefaultSort) && (
          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-surface-border rounded-md interactive-hover transition-all duration-ui"
          >
            <X className="w-4 h-4" />
            クリア
          </button>
        )}
      </div>
    </div>
  );
}