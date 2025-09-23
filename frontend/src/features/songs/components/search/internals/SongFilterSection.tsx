'use client';

import React from 'react';
import { SongFilterOptions } from '@/features/songs/types/types';
import { DateRangeSection } from '@/components/ui/DateRangeSection';

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
      <DateRangeSection
        title="歌唱日"
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
};
