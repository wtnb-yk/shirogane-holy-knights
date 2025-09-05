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

const ALL_OPTION = {
  id: 'all',
  label: 'すべて'
};

export const SongFrequencySection = ({
  filters = {},
  onFiltersChange,
  title = '歌唱回数',
}: SongFrequencySectionProps) => {
  const selectedCategories = filters?.frequencyCategories || [];

  const hasId = (item: any): item is typeof ALL_OPTION => 'id' in item;

  const handleItemClick = (item: typeof ALL_OPTION | typeof FREQUENCY_OPTIONS[0]) => {
    if (hasId(item) && item.id === 'all') {
      // 頻度のみクリア、他のフィルターは保持
      onFiltersChange({ 
        ...filters, 
        frequencyCategories: undefined 
      });
    } else {
      // 既存のカテゴリ処理
      const category = (item as typeof FREQUENCY_OPTIONS[0]).category;
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
    }
  };

  const isSelected = (item: typeof ALL_OPTION | typeof FREQUENCY_OPTIONS[0]) => {
    if (hasId(item) && item.id === 'all') {
      return selectedCategories.length === 0;
    }
    const category = (item as typeof FREQUENCY_OPTIONS[0]).category;
    return selectedCategories.includes(category);
  };

  const allItems = [ALL_OPTION, ...FREQUENCY_OPTIONS];

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <ul className="space-y-1">
        {allItems.map((item) => (
          <li key={hasId(item) ? item.id : (item as typeof FREQUENCY_OPTIONS[0]).category}>
            <button
              onClick={() => handleItemClick(item)}
              className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all ${
                isSelected(item)
                  ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                  : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
