'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SortOrderOption {
  value: string;
  label: string;
}

interface SortSectionProps {
  sortOptions: SortOption[];
  orderOptions: SortOrderOption[];
  selectedSort: string;
  selectedOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export const SortSection = ({
  sortOptions,
  orderOptions,
  selectedSort,
  selectedOrder,
  onSortChange
}: SortSectionProps) => {
  return (
    <div className="space-y-4">
      {/* ソート基準選択 */}
      <div className="space-y-3">
        {sortOptions.map((option) => {
          const isSelected = selectedSort === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value, selectedOrder)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-accent-gold bg-accent-gold-light'
                  : 'border-surface-border hover:bg-bg-secondary'
              }`}
            >
              <div className="flex items-center gap-3">
                <option.icon className={`w-4 h-4 ${isSelected ? 'text-accent-gold-dark' : 'text-text-secondary'}`} />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isSelected ? 'text-accent-gold-dark' : 'text-text-secondary'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-accent-gold rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* ソート順序選択 */}
      <div className="flex gap-2">
        {orderOptions.map((option) => {
          const isSelected = selectedOrder === option.value;
          const isAsc = option.value.toLowerCase().includes('asc');
          
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(selectedSort, option.value)}
              className={`flex-1 p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                isSelected
                  ? 'border-accent-gold bg-accent-gold text-white'
                  : 'border-surface-border text-text-secondary hover:bg-bg-secondary'
              }`}
            >
              {isAsc ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};