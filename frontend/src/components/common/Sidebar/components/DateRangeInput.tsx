'use client';

import React from 'react';

interface DateRangeInputProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  startLabel?: string;
  endLabel?: string;
}

export const DateRangeInput = ({
  startDate,
  endDate,
  onDateChange,
  startLabel = "開始日",
  endLabel = "終了日"
}: DateRangeInputProps) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          {startLabel}
        </label>
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onDateChange('startDate', e.target.value)}
          className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          {endLabel}
        </label>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => onDateChange('endDate', e.target.value)}
          className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
        />
      </div>
    </div>
  );
};