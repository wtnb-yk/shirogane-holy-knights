'use client';

import React from 'react';
import { SongFilterOptions } from '../types/types';

interface SongFilterSectionProps {
  filters: SongFilterOptions;
  onFiltersChange: (filters: SongFilterOptions) => void;
}

export const SongFilterSection = ({
  filters,
  onFiltersChange,
}: SongFilterSectionProps) => {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-text-primary mb-2">歌唱日</h4>
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-surface-border rounded-md text-sm 
                     focus:outline-none focus:ring-2 focus:ring-text-secondary focus:border-transparent
                     transition-all duration-200"
            placeholder="開始日"
          />
        </div>
        <span className="text-text-secondary">-</span>
        <div className="flex-1">
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-surface-border rounded-md text-sm 
                     focus:outline-none focus:ring-2 focus:ring-text-secondary focus:border-transparent
                     transition-all duration-200"
            placeholder="終了日"
          />
        </div>
      </div>
    </div>
  );
};