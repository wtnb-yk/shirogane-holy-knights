'use client';

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { SortBy, SortOrder } from '../types/types';

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
    { value: SortBy.LATEST_SING_DATE, label: '最新歌唱日', icon: Calendar, description: '最近歌った楽曲順' },
    { value: SortBy.SING_COUNT, label: '歌唱回数', icon: TrendingUp, description: '人気の高い楽曲順' }
  ];

  const getSortOrderLabel = () => {
    switch (sortBy) {
      case SortBy.SING_COUNT:
        return { desc: '多い → 少ない', asc: '少ない → 多い' };
      case SortBy.LATEST_SING_DATE:
        return { desc: '新しい → 古い', asc: '古い → 新しい' };
      default:
        return { desc: '降順', asc: '昇順' };
    }
  };

  const orderLabels = getSortOrderLabel();

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        並び替え
      </h4>
      <div className="space-y-2">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortBy)}
          className="w-full px-3 py-2 border border-surface-border rounded-md text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all bg-white"
        >
          {sortByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          className="w-full px-3 py-2 border border-surface-border rounded-md text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all bg-white"
        >
          <option value={SortOrder.DESC}>{orderLabels.desc}</option>
          <option value={SortOrder.ASC}>{orderLabels.asc}</option>
        </select>
      </div>
    </div>
  );
};