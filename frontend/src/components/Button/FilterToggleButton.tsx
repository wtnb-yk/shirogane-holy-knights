'use client';

import React from 'react';
import { Filter, Search } from 'lucide-react';

interface FilterToggleButtonProps {
  onClick: () => void;
  hasActiveFilters?: boolean;
  activeFiltersCount?: number;
  variant?: 'filter' | 'search';
  className?: string;
}

export const FilterToggleButton = ({
  onClick,
  hasActiveFilters = false,
  activeFiltersCount = 0,
  variant = 'filter',
  className = ''
}: FilterToggleButtonProps) => {
  const Icon = variant === 'search' ? Search : Filter;
  const buttonText = variant === 'search' ? '検索・絞り込み' : '絞り込み';

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-2 
        px-4 py-2 
        bg-bg-primary text-text-secondary border border-surface-border rounded-lg font-medium 
        hover:bg-bg-accent hover:text-text-primary transition-colors duration-200
        ${hasActiveFilters ? 'bg-accent-gold-light border-accent-gold/50' : ''}
        ${className}
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{buttonText}</span>
      
      {hasActiveFilters && activeFiltersCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-accent-gold text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-sm">
          {activeFiltersCount > 99 ? '99+' : activeFiltersCount}
        </span>
      )}
    </button>
  );
};
