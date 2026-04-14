'use client';

import React from 'react';
import { Select } from '@/components/Select/Select';
import { SortBy, SortOrder } from '@/features/songs/types/types';
import { BottomSheetSectionHeader } from '@/components/Section/BottomSheetSectionHeader';

interface SongSortSectionProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export const SongSortSection = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SongSortSectionProps) => {
  const sortByOptions = [
    { value: SortBy.LATEST_SING_DATE, label: '最新歌唱日' },
    { value: SortBy.SING_COUNT, label: '歌唱回数' }
  ];

  const getSortOrderOptions = () => {
    switch (sortBy) {
      case SortBy.SING_COUNT:
        return [
          { value: SortOrder.DESC, label: '多い → 少ない' },
          { value: SortOrder.ASC, label: '少ない → 多い' }
        ];
      case SortBy.LATEST_SING_DATE:
        return [
          { value: SortOrder.DESC, label: '新しい → 古い' },
          { value: SortOrder.ASC, label: '古い → 新しい' }
        ];
      default:
        return [
          { value: SortOrder.DESC, label: '降順' },
          { value: SortOrder.ASC, label: '昇順' }
        ];
    }
  };

  const sortOrderOptions = getSortOrderOptions();

  return (
    <div>
      <BottomSheetSectionHeader title="並び替え" />
      <div className="space-y-2">
        <Select
          value={sortBy}
          onChange={(value) => onSortByChange(value as SortBy)}
          options={sortByOptions}
        />
        <Select
          value={sortOrder}
          onChange={(value) => onSortOrderChange(value as SortOrder)}
          options={sortOrderOptions}
        />
      </div>
    </div>
  );
};
