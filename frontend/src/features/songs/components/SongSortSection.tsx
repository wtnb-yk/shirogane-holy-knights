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
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
          並び替え
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {sortByOptions.map((option) => {
            const isSelected = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSortByChange(option.value)}
                className={`relative flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-left ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold/10 shadow-sm'
                    : 'border-surface-border bg-white hover:border-accent-gold/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <option.icon className={`w-5 h-5 ${isSelected ? 'text-accent-gold' : 'text-text-secondary'}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-text-tertiary leading-relaxed">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-accent-gold rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
          並び順
        </h4>
        <div className="flex gap-3">
          <button
            onClick={() => onSortOrderChange(SortOrder.DESC)}
            className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] ${
              sortOrder === SortOrder.DESC
                ? 'border-accent-gold bg-accent-gold text-white shadow-sm'
                : 'border-surface-border bg-white text-text-secondary hover:border-accent-gold/50'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">{orderLabels.desc}</span>
          </button>
          <button
            onClick={() => onSortOrderChange(SortOrder.ASC)}
            className={`flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] ${
              sortOrder === SortOrder.ASC
                ? 'border-accent-gold bg-accent-gold text-white shadow-sm'
                : 'border-surface-border bg-white text-text-secondary hover:border-accent-gold/50'
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