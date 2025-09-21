'use client';

import React from 'react';
import { TagFilterSection } from '@/components/common/TagFilterSection';
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
  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <TagFilterSection
          selectedTags={filters.selectedTags}
          availableTags={availableTags}
          onTagToggle={handleTagToggle}
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
