'use client';

import React from 'react';
import { SingFrequencyCategory } from '../types/types';

interface SongFrequencyFilterProps {
  selectedCategories: SingFrequencyCategory[];
  onCategoriesChange: (categories: SingFrequencyCategory[]) => void;
}

const FREQUENCY_OPTIONS = [
  {
    category: SingFrequencyCategory.LOW,
    label: '1-2回',
    description: 'あまり歌われていない楽曲'
  },
  {
    category: SingFrequencyCategory.MEDIUM,
    label: '3-5回',
    description: '時々歌われる楽曲'
  },
  {
    category: SingFrequencyCategory.HIGH,
    label: '6-10回',
    description: 'よく歌われる楽曲'
  },
  {
    category: SingFrequencyCategory.VERY_HIGH,
    label: '11回以上',
    description: '定番楽曲'
  }
];

export const SongFrequencyFilter = ({
  selectedCategories,
  onCategoriesChange,
}: SongFrequencyFilterProps) => {
  const handleCategoryToggle = (category: SingFrequencyCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        歌唱回数
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {FREQUENCY_OPTIONS.map(({ category, label, description }) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`relative flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-left ${
                isSelected
                  ? 'border-accent-gold bg-accent-gold/10 shadow-sm'
                  : 'border-surface-border bg-white hover:border-accent-gold/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {label}
                </span>
                {isSelected && (
                  <div className="ml-auto w-2 h-2 bg-accent-gold rounded-full" />
                )}
              </div>
              <span className="text-xs text-text-tertiary leading-relaxed">
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
