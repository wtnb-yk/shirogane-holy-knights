'use client';

import React, { ReactNode } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { IconButton } from '@/components/Button';

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
          <IconButton
            icon={ChevronLeft}
            onClick={backButton.onClick}
            iconClassName="w-6 h-6"
            aria-label="戻る"
            iconOnly
          />
        )}
        <h2 className="text-lg font-bold text-text-primary">
          {title}
        </h2>
      </div>
      <IconButton
        icon={X}
        onClick={onClose}
        iconClassName="w-6 h-6"
        aria-label="閉じる"
        iconOnly
      />
    </div>
  );
};
