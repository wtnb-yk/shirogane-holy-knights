'use client';

import React from 'react';
import { SelectableList } from '@/components/common/SelectableList';
import { SingFrequencyCategory, SongFilterOptions } from "@/features/songs/types/types";

interface FrequencyItem {
  id: string;
  category: SingFrequencyCategory;
  label: string;
  description: string;
}

interface SongFrequencySectionProps {
  filters: SongFilterOptions;
  onFiltersChange: (filters: SongFilterOptions) => void;
  title?: string;
}

const FREQUENCY_OPTIONS: FrequencyItem[] = [
  {
    id: 'low',
    category: SingFrequencyCategory.LOW,
    label: '1-2回',
    description: 'あまり歌われていない'
  },
  {
    id: 'medium',
    category: SingFrequencyCategory.MEDIUM,
    label: '3-5回',
    description: '時々歌われる'
  },
  {
    id: 'high',
    category: SingFrequencyCategory.HIGH,
    label: '6-10回',
    description: 'よく歌われる'
  },
  {
    id: 'very_high',
    category: SingFrequencyCategory.VERY_HIGH,
    label: '11回以上',
    description: '定番楽曲'
  }
];

export const SongFrequencySection = ({
  filters = {},
  onFiltersChange,
  title = '歌唱回数',
}: SongFrequencySectionProps) => {
  const selectedCategories = filters?.frequencyCategories || [];

  const handleItemToggle = (frequencyItem: FrequencyItem) => {
    const category = frequencyItem.category;

    // 択一選択：同じカテゴリが選択されていればクリア、そうでなければ単一選択
    const newCategories = selectedCategories.includes(category)
      ? undefined
      : [category];

    onFiltersChange({
      ...filters,
      frequencyCategories: newCategories
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      frequencyCategories: undefined
    });
  };

  // 現在選択されている頻度アイテムを判定
  const selectedItems: FrequencyItem[] = FREQUENCY_OPTIONS.filter(item =>
    selectedCategories.includes(item.category)
  );

  return (
    <SelectableList<FrequencyItem>
      title={title}
      items={FREQUENCY_OPTIONS}
      selectedItems={selectedItems}
      onItemToggle={handleItemToggle}
      onClearAll={handleClearAll}
      getDisplayName={(item) => item.label}
      getItemKey={(item) => item.id}
      allOptionLabel="すべて"
    />
  );
};
