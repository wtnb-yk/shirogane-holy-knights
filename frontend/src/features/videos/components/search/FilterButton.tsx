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
      className="px-6 py-3 bg-white border border-sage-200 rounded-lg flex items-center gap-2 hover:bg-sage-100 transition-all duration-200 shadow-sm" 
      onClick={onFilterClick}
      disabled={disabled}
    >
      <Filter className="w-5 h-5 text-sage-300" />
      <span className="text-sage-300">フィルター</span>
    </button>
  );
};