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
      {/* 歌唱日フィルター */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
          歌唱日
        </h4>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-xs font-medium text-text-secondary mb-1">開始日</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                       transition-all duration-200 bg-white"
            />
          </div>
          <div className="flex items-center justify-center pt-5">
            <div className="w-3 h-px bg-text-tertiary"></div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-text-secondary mb-1">終了日</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2.5 border border-surface-border rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold
                       transition-all duration-200 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};