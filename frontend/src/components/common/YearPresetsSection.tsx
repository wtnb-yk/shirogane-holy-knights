'use client';

import React from 'react';
import { SelectableList } from './SelectableList';

interface YearItem {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

interface YearPresetsSectionProps {
  filters: {
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
  title?: string;
  minYear?: number;
}

export const YearPresetsSection = ({
  filters,
  onFiltersChange,
  title = '歌唱日',
  minYear = 2020,
}: YearPresetsSectionProps) => {
  const currentYear = new Date().getFullYear();
  const yearItems: YearItem[] = [];

  for (let year = currentYear; year >= minYear; year--) {
    yearItems.push({
      id: `year-${year}`,
      label: `${year}年`,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    });
  }

  const handleItemToggle = (yearItem: YearItem) => {
    onFiltersChange({
      ...filters,
      startDate: yearItem.startDate,
      endDate: yearItem.endDate
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined
    });
  };

  // 現在の日付フィルターに対応する年を判定
  const selectedItems: YearItem[] = [];

  if (filters?.startDate && filters?.endDate) {
    const matchingYear = yearItems.find(yearItem =>
      yearItem.startDate === filters.startDate &&
      yearItem.endDate === filters.endDate
    );

    if (matchingYear) {
      selectedItems.push(matchingYear);
    }
  }

  return (
    <SelectableList<YearItem>
      title={title}
      items={yearItems}
      selectedItems={selectedItems}
      onItemToggle={handleItemToggle}
      onClearAll={handleClearAll}
      getDisplayName={(yearItem) => yearItem.label}
      getItemKey={(yearItem) => yearItem.id}
      allOptionLabel="すべて"
    />
  );
};
