'use client';

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { SearchOptionsButton } from '@/components/ui/SearchOptionsButton';
import { SortBy, SortOrder } from '../types/types';

interface SongSearchBarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onOptionsClick: () => void;
  hasActiveOptions?: boolean;
}

export function SongSearchBar({
  searchValue,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  onOptionsClick,
  hasActiveOptions = false
}: SongSearchBarProps) {

  const getSortDisplayInfo = () => {
    const sortByInfo = {
      [SortBy.SING_COUNT]: { label: '歌唱回数', icon: TrendingUp },
      [SortBy.LATEST_SING_DATE]: { label: '最新歌唱日', icon: Calendar }
    };
    
    return sortByInfo[sortBy] || { label: '歌唱回数', icon: TrendingUp };
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
    <div className="mb-3 md:mb-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-wrap gap-2 md:gap-4 mb-3">
        <SearchInput
          searchValue={searchValue}
          onSearch={onSearch}
          onClearSearch={onClearSearch}
          placeholder="楽曲名・アーティスト名を入力してください"
        />
        
        <SearchOptionsButton
          onClick={onOptionsClick}
          hasActiveOptions={hasActiveOptions}
        />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="text-text-tertiary">並び順:</span>
        <sortDisplayInfo.icon className="w-4 h-4" />
        <span>{sortDisplayInfo.label}</span>
        <span className="text-text-tertiary">•</span>
        <span>{getSortOrderLabel()}</span>
      </div>
    </div>
  );
}
