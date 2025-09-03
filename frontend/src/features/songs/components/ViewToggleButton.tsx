'use client';

import React from 'react';
import { Grid, List } from 'lucide-react';
import { ViewMode } from '../types/types';

interface ViewToggleButtonProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggleButton({ viewMode, onViewModeChange, className = '' }: ViewToggleButtonProps) {
  return (
    <div className={`flex rounded-lg bg-bg-secondary p-1 ${className}`}>
      <button
        onClick={() => onViewModeChange(ViewMode.GRID)}
        className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-ui ${
          viewMode === ViewMode.GRID
            ? 'bg-white text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
        }`}
        aria-label="グリッド表示に切り替え"
        title="グリッド表示"
      >
        <Grid className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline">グリッド</span>
      </button>
      <button
        onClick={() => onViewModeChange(ViewMode.LIST)}
        className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-ui ${
          viewMode === ViewMode.LIST
            ? 'bg-white text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
        }`}
        aria-label="リスト表示に切り替え"
        title="リスト表示"
      >
        <List className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline">リスト</span>
      </button>
    </div>
  );
}