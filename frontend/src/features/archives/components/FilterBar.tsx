'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
  // モーダル内では常に展開状態
  const isExpanded = true;

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };


  const clearAllFilters = () => {
    onFiltersChange({
      selectedTags: [],
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters = filters.selectedTags.length > 0 || 
    filters.startDate || filters.endDate;

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
          {/* タグフィルター */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">タグ</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filters.selectedTags.includes(tag)
                        ? 'bg-sage-300 text-white hover:bg-sage-300/80'
                        : 'border-sage-200 text-sage-300 hover:border-sage-300 hover:text-gray-600'
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">配信日</h4>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-sage-200 rounded-md text-sm 
                           focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent
                           transition-all duration-200"
                  placeholder="開始日"
                />
              </div>
              <span className="text-sage-300">-</span>
              <div className="flex-1">
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-sage-200 rounded-md text-sm 
                           focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent
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