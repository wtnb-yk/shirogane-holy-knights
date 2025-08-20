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

  const getCurrentSortLabel = () => {
    const labels = {
      [`${SortBy.SING_COUNT}-${SortOrder.DESC}`]: '歌唱回数順',
      [`${SortBy.SING_COUNT}-${SortOrder.ASC}`]: '歌唱回数順（少→多）',
      [`${SortBy.LATEST_SING_DATE}-${SortOrder.DESC}`]: '最新順',
      [`${SortBy.LATEST_SING_DATE}-${SortOrder.ASC}`]: '最新順（古→新）',
      [`${SortBy.TITLE}-${SortOrder.ASC}`]: 'あいうえお順',
      [`${SortBy.TITLE}-${SortOrder.DESC}`]: 'わをん順'
    };
    return labels[`${sortBy}-${sortOrder}`] || '歌唱回数順';
  };

  return (
    <div className="mb-4 md:mb-8 flex flex-wrap gap-2 md:gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <SearchInput
        searchValue={searchValue}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        placeholder="楽曲名・アーティスト名で検索..."
      />
      
      <SongSortButton
        onSortClick={onSortClick}
        currentSortLabel={getCurrentSortLabel()}
      />
    </div>
  );
}
