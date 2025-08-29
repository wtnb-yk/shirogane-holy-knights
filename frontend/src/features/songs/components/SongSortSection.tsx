'use client';

import React from 'react';
import { ChevronUp, ChevronDown, TrendingUp, Calendar } from 'lucide-react';
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
    { value: SortBy.SING_COUNT, label: '歌唱回数', icon: TrendingUp, description: '人気の高い楽曲順' },
    { value: SortBy.LATEST_SING_DATE, label: '最新歌唱日', icon: Calendar, description: '最近歌った楽曲順' }
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
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">並び替え</h3>
        <div className="space-y-2">
          {sortByOptions.map((option) => {
            const isSelected = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSortByChange(option.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-text-secondary bg-text-secondary/5 shadow-sm'
                    : 'border-surface-border hover:border-text-secondary/50 hover:bg-bg-accent/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <option.icon className="w-5 h-5 text-text-secondary" />
                  <div>
                    <div className={`font-medium ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-text-secondary rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex gap-2">
          <button
            onClick={() => onSortOrderChange(SortOrder.DESC)}
            className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200 ${
              sortOrder === SortOrder.DESC
                ? 'border-text-secondary bg-text-secondary text-white'
                : 'border-surface-border text-text-secondary hover:border-text-secondary hover:text-text-primary'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">{orderLabels.desc}</span>
          </button>
          <button
            onClick={() => onSortOrderChange(SortOrder.ASC)}
            className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200 ${
              sortOrder === SortOrder.ASC
                ? 'border-text-secondary bg-text-secondary text-white'
                : 'border-surface-border text-text-secondary hover:border-text-secondary hover:text-text-primary'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-medium">{orderLabels.asc}</span>
          </button>
        </div>
      </div>
    </div>
  );
};