'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortBy, SortOrder } from '../types/types';

interface SongSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

export const SongSortModal = ({
  isOpen,
  onClose,
  sortBy,
  sortOrder,
  onSortChange
}: SongSortModalProps) => {
  if (!isOpen) return null;

  const handleSortByChange = (newSortBy: SortBy) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    onSortChange(sortBy, newSortOrder);
  };

  const sortByOptions = [
    { value: SortBy.SING_COUNT, label: '歌唱回数', icon: '🔥', description: '人気の高い楽曲順' },
    { value: SortBy.LATEST_SING_DATE, label: '最新歌唱日', icon: '📅', description: '最近歌った楽曲順' }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-primary rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary">並び替え設定</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">並び替え項目</h3>
              <div className="space-y-2">
                {sortByOptions.map((option) => {
                  const isSelected = sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortByChange(option.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-text-secondary bg-text-secondary/5 shadow-sm'
                          : 'border-surface-border hover:border-text-secondary/50 hover:bg-bg-accent/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{option.icon}</span>
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
              <h3 className="text-sm font-medium text-text-primary mb-3">並び順</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortOrderChange(SortOrder.DESC)}
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
                  onClick={() => handleSortOrderChange(SortOrder.ASC)}
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
          
          <div className="mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-text-secondary/90 transition-colors"
            >
              適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};