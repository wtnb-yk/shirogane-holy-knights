'use client';

import React from 'react';

interface MobileDateRangeInputProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  startLabel?: string;
  endLabel?: string;
}

export const MobileDateRangeInput = ({
  startDate,
  endDate,
  onDateChange,
  startLabel = "開始日",
  endLabel = "終了日"
}: MobileDateRangeInputProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">
          {startLabel}
        </label>
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onDateChange('startDate', e.target.value)}
          className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                   transition-all duration-200 bg-white [-webkit-appearance:none]"
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <div className="w-3 h-px bg-text-tertiary"></div>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-text-secondary mb-1">
          {endLabel}
        </label>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => onDateChange('endDate', e.target.value)}
          className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                   transition-all duration-200 bg-white [-webkit-appearance:none]"
        />
      </div>
    </div>
  );
};