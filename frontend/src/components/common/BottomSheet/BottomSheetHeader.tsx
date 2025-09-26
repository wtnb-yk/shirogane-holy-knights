'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetHeaderProps {
  title: ReactNode;
  onClose: () => void;
}

export const BottomSheetHeader = ({
  title,
  onClose,
}: BottomSheetHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <h2 className="text-lg font-bold text-text-primary">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="p-2 text-text-primary hover:text-accent-gold transition-colors rounded-lg hover:bg-surface-hover"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
