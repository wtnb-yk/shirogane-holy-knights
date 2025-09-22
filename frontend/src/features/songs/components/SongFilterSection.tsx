'use client';

import React from 'react';
import { SongFilterOptions } from '../types/types';
import { MobileDateRangeInput } from '@/components/common/Sidebar/MobileDateRangeInput';

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
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
          歌唱日
        </h4>
        <MobileDateRangeInput
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateChange={handleDateChange}
        />
      </div>
    </div>
  );
};