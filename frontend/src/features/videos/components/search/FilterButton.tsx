'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterButtonProps {
  onFilterClick?: () => void;
  disabled?: boolean;
}

export const FilterButton = ({ 
  onFilterClick,
  disabled = false
}: FilterButtonProps) => {
  return (
    <button 
      className="px-3 md:px-6 py-2 md:py-3 bg-bg-primary border border-surface-border rounded-lg flex items-center gap-1 md:gap-2 interactive-hover transition-all duration-ui shadow-sm" 
      onClick={onFilterClick}
      disabled={disabled}
    >
      <Filter className="w-4 h-4 md:w-5 md:h-5 text-text-secondary" />
      <span className="text-text-secondary text-sm md:text-base">フィルター</span>
    </button>
  );
};