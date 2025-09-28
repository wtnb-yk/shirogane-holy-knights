'use client';

import React, { ReactNode } from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface BottomSheetHeaderProps {
  title: ReactNode;
  onClose: () => void;
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export const BottomSheetHeader = ({
  title,
  onClose,
  backButton,
}: BottomSheetHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {backButton?.show && (
          <button
            onClick={backButton.onClick}
            className="p-3 text-text-primary hover:text-accent-gold transition-colors rounded-lg hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="戻る"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-lg font-bold text-text-primary">
          {title}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="p-3 text-text-primary hover:text-accent-gold transition-colors rounded-lg hover:bg-surface-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="閉じる"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
