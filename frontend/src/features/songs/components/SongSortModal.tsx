'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
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

  const handleSortSelect = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    onSortChange(newSortBy, newSortOrder);
  };

  const sortOptions = [
    { sortBy: SortBy.SING_COUNT, sortOrder: SortOrder.DESC, label: '歌唱回数順' },
    { sortBy: SortBy.SING_COUNT, sortOrder: SortOrder.ASC, label: '歌唱回数順（少→多）' },
    { sortBy: SortBy.LATEST_SING_DATE, sortOrder: SortOrder.DESC, label: '最新順' },
    { sortBy: SortBy.LATEST_SING_DATE, sortOrder: SortOrder.ASC, label: '最新順（古→新）' },
    { sortBy: SortBy.TITLE, sortOrder: SortOrder.ASC, label: 'あいうえお順' },
    { sortBy: SortBy.TITLE, sortOrder: SortOrder.DESC, label: 'わをん順' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-primary rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">並び替え設定</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-secondary transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">並び順</h4>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => {
                const isSelected = sortBy === option.sortBy && sortOrder === option.sortOrder;
                return (
                  <Badge
                    key={`${option.sortBy}-${option.sortOrder}`}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 ${
                      isSelected
                        ? 'bg-text-secondary text-white hover:bg-text-secondary/80'
                        : 'border-surface-border text-text-secondary hover:border-text-secondary hover:text-text-primary hover:bg-bg-accent/20'
                    }`}
                    onClick={() => handleSortSelect(option.sortBy, option.sortOrder)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-bg-accent/80 transition-colors"
            >
              適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};