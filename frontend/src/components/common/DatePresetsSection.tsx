'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

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

const DATE_PRESETS = [
  {
    id: 'thisMonth',
    label: '今月',
    icon: Calendar,
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
    icon: Calendar,
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
    icon: Clock,
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

const ALL_OPTION = {
  id: 'all',
  label: 'すべて'
};

export const DatePresetsSection = ({
  filters,
  onFiltersChange,
  title = '期間',
}: DatePresetsSectionProps) => {
  const handleItemClick = (item: typeof ALL_OPTION | typeof DATE_PRESETS[0]) => {
    if (item.id === 'all') {
      // 日付のみクリア、他のフィルターは保持
      onFiltersChange({ 
        ...filters, 
        startDate: undefined, 
        endDate: undefined 
      });
    } else {
      // 既存のプリセット処理
      const range = (item as typeof DATE_PRESETS[0]).getRange();
      onFiltersChange({ 
        ...filters, 
        startDate: range.startDate, 
        endDate: range.endDate 
      });
    }
  };

  const isSelected = (item: typeof ALL_OPTION | typeof DATE_PRESETS[0]) => {
    if (item.id === 'all') {
      return !filters?.startDate && !filters?.endDate;
    }
    return false; // プリセットの選択状態は表示しない（一時的な選択なので）
  };

  const allItems = [ALL_OPTION, ...DATE_PRESETS];

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <ul className="space-y-1">
        {allItems.map((item) => (
          <li key={item.id}>
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