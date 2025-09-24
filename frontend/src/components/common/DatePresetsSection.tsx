'use client';

import React from 'react';
import { SelectableList } from './SelectableList';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DatePresetsSectionProps {
  filters: {
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
  title?: string;
}

const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalDate = (year: number, month: number, day: number) => {
  const date = new Date();
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

interface DatePreset {
  id: string;
  label: string;
  getRange: () => DateRange;
}

const DATE_PRESETS: DatePreset[] = [
  {
    id: 'thisMonth',
    label: '今月',
    getRange: (): DateRange => {
      const now = new Date();
      const start = getLocalDate(now.getFullYear(), now.getMonth(), 1);
      const end = new Date();
      return {
        startDate: getDateString(start),
        endDate: getDateString(end)
      };
    }
  },
  {
    id: 'lastMonth',
    label: '先月',
    getRange: (): DateRange => {
      const now = new Date();
      const start = getLocalDate(now.getFullYear(), now.getMonth() - 1, 1);
      const end = getLocalDate(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: getDateString(start),
        endDate: getDateString(end)
      };
    }
  },
  {
    id: 'last3Months',
    label: '過去3ヶ月',
    getRange: (): DateRange => {
      const now = new Date();
      const start = getLocalDate(now.getFullYear(), now.getMonth() - 3, 1);
      const end = new Date();
      return {
        startDate: getDateString(start),
        endDate: getDateString(end)
      };
    }
  }
];

export const DatePresetsSection = ({
  filters,
  onFiltersChange,
  title = '期間',
}: DatePresetsSectionProps) => {
  const handleItemToggle = (preset: DatePreset) => {
    const range = preset.getRange();
    onFiltersChange({
      ...filters,
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined
    });
  };

  // 現在の日付フィルターに対応するプリセットを判定
  const selectedItems: DatePreset[] = [];

  if (filters?.startDate && filters?.endDate) {
    const currentFilter = {
      startDate: filters.startDate,
      endDate: filters.endDate
    };

    // 各プリセットの日付範囲と現在のフィルターを比較
    const matchingPreset = DATE_PRESETS.find(preset => {
      const presetRange = preset.getRange();
      return presetRange.startDate === currentFilter.startDate &&
             presetRange.endDate === currentFilter.endDate;
    });

    if (matchingPreset) {
      selectedItems.push(matchingPreset);
    }
  }

  return (
    <SelectableList<DatePreset>
      title={title}
      items={DATE_PRESETS}
      selectedItems={selectedItems}
      onItemToggle={handleItemToggle}
      onClearAll={handleClearAll}
      getDisplayName={(preset) => preset.label}
      getItemKey={(preset) => preset.id}
      allOptionLabel="すべて"
    />
  );
};
