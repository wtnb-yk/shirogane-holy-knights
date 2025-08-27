import React from 'react';
import { X } from 'lucide-react';

interface SongSearchResultsSummaryProps {
  searchQuery: string;
  totalCount: number;
  onClearSearch: () => void;
}

export function SongSearchResultsSummary({
  searchQuery,
  totalCount,
  onClearSearch
}: SongSearchResultsSummaryProps) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  
  if (!hasSearchQuery) {
    return null;
  }

  const parts = [];
  if (hasSearchQuery) parts.push(`「${searchQuery}」`);

  return (
    <div className="mb-6 py-2 px-3 bg-bg-accent/30 border border-surface-border/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-primary">
            {parts.join(' / ')}{parts.length > 0 && 'の'}検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        {hasSearchQuery && (
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
