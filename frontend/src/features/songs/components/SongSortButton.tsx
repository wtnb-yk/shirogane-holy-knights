'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface SongSortButtonProps {
  onSortClick?: () => void;
  disabled?: boolean;
  currentSortLabel: string;
}

export const SongSortButton = ({ 
  onSortClick,
  disabled = false,
  currentSortLabel
}: SongSortButtonProps) => {
  return (
    <button 
      className="px-3 md:px-6 py-2 md:py-3 bg-bg-primary border border-surface-border rounded-lg flex items-center gap-1 md:gap-2 interactive-hover transition-all duration-ui shadow-sm" 
      onClick={onSortClick}
      disabled={disabled}
    >
      <Filter className="w-4 h-4 md:w-5 md:h-5 text-text-secondary" />
      <span className="text-text-secondary text-sm md:text-base">{currentSortLabel}</span>
    </button>
  );
};