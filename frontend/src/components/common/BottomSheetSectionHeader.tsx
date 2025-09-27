'use client';

import React from 'react';

interface BottomSheetSectionHeaderProps {
  title: string;
}

export const BottomSheetSectionHeader = ({ title }: BottomSheetSectionHeaderProps) => {
  return (
    <div className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2 mb-4">
      <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
      {title}
    </div>
  );
};
