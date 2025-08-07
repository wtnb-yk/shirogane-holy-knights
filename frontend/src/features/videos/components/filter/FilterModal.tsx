'use client';

import React from 'react';
import { FilterBar, FilterOptions } from './FilterBar';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
  onClearAllFilters: () => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableTags,
  onClearAllFilters
}: FilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-primary rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">フィルター設定</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-secondary transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <FilterBar
            filters={filters}
            onFiltersChange={onFiltersChange}
            availableTags={availableTags}
          />
          <div className="flex gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-bg-accent/80 transition-colors"
            >
              適用
            </button>
            <button
              onClick={() => {
                onClearAllFilters();
                onClose();
              }}
              className="px-4 py-2 border border-surface-border text-text-secondary rounded-md hover:bg-bg-accent transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};