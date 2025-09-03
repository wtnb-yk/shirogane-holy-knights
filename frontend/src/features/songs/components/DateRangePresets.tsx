'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePresetsProps {
  onPresetSelect: (dateRange: DateRange) => void;
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
  },
  {
    id: 'last6Months',
    label: '過去6ヶ月',
    icon: Clock,
    getRange: (): DateRange => {
      const now = new Date();
      const start = getLocalDate(now.getFullYear(), now.getMonth() - 6, 1);
      const end = new Date();
      return {
        startDate: getDateString(start),
        endDate: getDateString(end)
      };
    }
  },
  {
    id: 'thisYear',
    label: '今年',
    icon: Calendar,
    getRange: (): DateRange => {
      const now = new Date();
      const start = getLocalDate(now.getFullYear(), 0, 1);
      const end = new Date();
      return {
        startDate: getDateString(start),
        endDate: getDateString(end)
      };
    }
  }
];

export const DateRangePresets = ({ onPresetSelect }: DateRangePresetsProps) => {
  const handlePresetClick = (preset: typeof DATE_PRESETS[0]) => {
    const range = preset.getRange();
    onPresetSelect(range);
  };

  return (
    <div className="border-t border-surface-border/50 pt-3 mt-3">
      <h5 className="text-xs font-semibold text-text-primary mb-3 flex items-center gap-1.5">
        <div className="w-1 h-3 bg-text-secondary rounded-full"></div>
        クイック選択
      </h5>
      <div className="flex flex-wrap gap-2">
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-surface-border bg-white text-text-secondary hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold/5 transition-all duration-200 hover:scale-105"
          >
            <preset.icon className="w-3 h-3" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};