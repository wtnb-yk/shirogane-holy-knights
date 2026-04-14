'use client';

import React from 'react';
import {BottomSheetSectionHeader} from "@/components/Section/BottomSheetSectionHeader";

interface DateRangeSectionProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  title?: string;
}

export const DateRangeSection = ({
  startDate,
  endDate,
  onDateChange,
  title = '配信日'
}: DateRangeSectionProps) => {
  return (
    <div>
      <BottomSheetSectionHeader title={title} />
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs font-medium text-text-secondary mb-1">開始日</label>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => onDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                     transition-all duration-200 bg-white/90"
          />
        </div>
        <div className="flex items-center justify-center pt-5">
          <div className="w-3 h-px bg-white"></div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-text-secondary mb-1">終了日</label>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                     transition-all duration-200 bg-white/90"
          />
        </div>
      </div>
    </div>
  );
};
