'use client';

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { SortBy, SortOrder } from '../types/types';
import { SongSortButton } from './SongSortButton';

interface SongSearchBarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onSortClick: () => void;
}

export function SongSearchBar({
  searchValue,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  onSortClick
}: SongSearchBarProps) {

  const getSortDisplayInfo = () => {
    const sortByInfo = {
      [SortBy.SING_COUNT]: { label: '歌唱回数', icon: '🔥' },
      [SortBy.LATEST_SING_DATE]: { label: '最新歌唱日', icon: '📅' }
    };
    
    return sortByInfo[sortBy] || { label: '歌唱回数', icon: '🔥' };
  };

  const getSortOrderLabel = () => {
    switch (sortBy) {
      case SortBy.SING_COUNT:
        return sortOrder === SortOrder.DESC ? '多い順' : '少ない順';
      case SortBy.LATEST_SING_DATE:
        return sortOrder === SortOrder.DESC ? '新しい順' : '古い順';
      default:
        return sortOrder === SortOrder.DESC ? '降順' : '昇順';
    }
  };

  const sortDisplayInfo = getSortDisplayInfo();

  return (
    <div className="mb-4 md:mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-wrap gap-2 md:gap-4 mb-3">
        <SearchInput
          searchValue={searchValue}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          placeholder="楽曲名で検索..."
        />
        
        <SongSortButton
          onSortClick={onSortClick}
        />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="text-text-tertiary">並び順:</span>
        <span className="text-base">{sortDisplayInfo.icon}</span>
        <span>{sortDisplayInfo.label}</span>
        <span className="text-text-tertiary">•</span>
        <span>{getSortOrderLabel()}</span>
      </div>
    </div>
  );
}
