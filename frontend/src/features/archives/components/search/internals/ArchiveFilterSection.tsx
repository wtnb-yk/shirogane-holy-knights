'use client';

import React from 'react';
import { MultiSelectSection } from '@/components/common/MultiSelectSection';
import { DateRangeSection } from '@/components/common/DateRangeSection';
export interface FilterOptions {
  selectedTags: string[];
  startDate?: string;
  endDate?: string;
}

interface ArchiveFilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags?: string[];
  className?: string;
}

export function ArchiveFilterSection({
  filters, 
  onFiltersChange, 
  availableTags = [], 
  className = '' 
}: ArchiveFilterSectionProps) {
  const handleTagsChange = (newTags: string[]) => {
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <MultiSelectSection
          value={filters.selectedTags}
          options={availableTags}
          onChange={handleTagsChange}
          title="タグ"
          placeholder="タグを選択"
        />
        
        <DateRangeSection
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateChange={handleDateChange}
        />
      </div>
    </div>
  );
}
