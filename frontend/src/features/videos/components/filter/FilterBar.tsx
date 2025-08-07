'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface FilterOptions {
  selectedTags: string[];
  startDate?: string;
  endDate?: string;
}

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags?: string[];
  className?: string;
}


export function FilterBar({ 
  filters, 
  onFiltersChange, 
  availableTags = [], 
  className = '' 
}: FilterBarProps) {
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
    <div className={`${className}`}>
      <div className="space-y-4">
          {/* タグフィルター */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">タグ</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filters.selectedTags.includes(tag)
                        ? 'bg-text-secondary text-white hover:bg-bg-accent/80'
                        : 'border-surface-border text-text-secondary hover:border-text-secondary hover:text-text-secondary'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 日付範囲フィルター */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">配信日</h4>
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

        </div>
    </div>
  );
}
