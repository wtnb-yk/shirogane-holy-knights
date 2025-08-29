'use client';

import React from 'react';
import { Settings } from 'lucide-react';

interface SearchOptionsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  hasActiveOptions?: boolean;
}

export const SearchOptionsButton = ({ 
  onClick,
  disabled = false,
  hasActiveOptions = false
}: SearchOptionsButtonProps) => {
  return (
    <button 
      className={`px-3 md:px-6 py-2 md:py-3 bg-bg-primary border rounded-lg flex items-center gap-1 md:gap-2 interactive-hover transition-all duration-ui shadow-sm font-medium text-sm md:text-base ${
        hasActiveOptions 
          ? 'border-text-secondary text-text-secondary bg-text-secondary/10 hover:bg-text-secondary/20' 
          : 'border-surface-border text-text-secondary hover:text-text-primary hover:border-text-secondary hover:bg-bg-accent/20'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Settings className="w-4 h-4 md:w-5 md:h-5" />
      <span>検索オプション</span>
      {hasActiveOptions && (
        <span className="ml-1 w-2 h-2 bg-text-secondary rounded-full"></span>
      )}
    </button>
  );
};