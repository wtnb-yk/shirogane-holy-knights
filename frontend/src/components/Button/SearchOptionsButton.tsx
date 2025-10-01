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
      className={`w-full py-2.5 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
        hasActiveOptions
          ? 'border-text-secondary text-text-secondary bg-text-secondary/10 hover:bg-text-secondary/20'
          : 'border-surface-border text-text-secondary bg-white hover:text-text-primary hover:border-text-secondary hover:bg-bg-accent/20'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Settings className="w-4 h-4" />
      <span>検索オプション</span>
      {hasActiveOptions && (
        <span className="ml-1 w-2 h-2 bg-text-secondary rounded-full"></span>
      )}
    </button>
  );
};