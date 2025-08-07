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
      className="px-6 py-3 bg-white border border-shirogane-surface-border rounded-lg flex items-center gap-2 hover:bg-shirogane-bg-accent transition-all duration-200 shadow-sm" 
      onClick={onFilterClick}
      disabled={disabled}
    >
      <Filter className="w-5 h-5 text-shirogane-text-secondary" />
      <span className="text-shirogane-text-secondary">フィルター</span>
    </button>
  );
};