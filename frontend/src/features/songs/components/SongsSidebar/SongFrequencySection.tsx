'use client';

import React from 'react';
import { SongFilterOptions, SingFrequencyCategory } from '../../types/types';

interface SongFrequencySectionProps {
  filters: SongFilterOptions;
  onFiltersChange: (filters: SongFilterOptions) => void;
  title?: string;
}

const FREQUENCY_OPTIONS = [
  {
    category: SingFrequencyCategory.LOW,
    label: '1-2回',
    description: 'あまり歌われていない'
  },
  {
    category: SingFrequencyCategory.MEDIUM,
    label: '3-5回',
    description: '時々歌われる'
  },
  {
    category: SingFrequencyCategory.HIGH,
    label: '6-10回',
    description: 'よく歌われる'
  },
  {
    category: SingFrequencyCategory.VERY_HIGH,
    label: '11回以上',
    description: '定番楽曲'
  }
];

export const SongFrequencySection = ({
  filters = {},
  onFiltersChange,
  title = '歌唱頻度',
}: SongFrequencySectionProps) => {
  const selectedCategories = filters?.frequencyCategories || [];

  const handleCategoryToggle = (category: SingFrequencyCategory) => {
    let newCategories: SingFrequencyCategory[];
    
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter(c => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    
    onFiltersChange({ 
      ...filters, 
      frequencyCategories: newCategories.length > 0 ? newCategories : undefined 
    });
  };

  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <ul className="space-y-1">
        {FREQUENCY_OPTIONS.map(({ category, label }) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <li key={category}>
              <button
                onClick={() => handleCategoryToggle(category)}
                className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all ${
                  isSelected
                    ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                    : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
                }`}
              >
                {label}
              </button>
            </li>
          );
        })}
        
        {hasActiveFilters && (
          <li>
            <button
              onClick={() => onFiltersChange({ ...filters, frequencyCategories: undefined })}
              className="w-full text-left py-2 px-3 rounded-md text-xs transition-all text-text-tertiary hover:bg-surface-border/20 hover:pl-4"
            >
              頻度クリア
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
