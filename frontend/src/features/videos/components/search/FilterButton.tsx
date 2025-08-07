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
      className="px-6 py-3 bg-bg-primary border border-surface-border rounded-lg flex items-center gap-2 interactive-hover transition-all duration-ui shadow-sm" 
      onClick={onFilterClick}
      disabled={disabled}
    >
      <Filter className="w-5 h-5 text-text-secondary" />
      <span className="text-text-secondary">フィルター</span>
    </button>
  );
};