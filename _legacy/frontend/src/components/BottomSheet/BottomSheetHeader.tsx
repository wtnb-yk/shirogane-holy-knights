'use client';

import React, { ReactNode } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { IconButton } from '@/components/Button/IconButton';

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
            icon={<ChevronLeft className="w-6 h-6" />}
            onClick={backButton.onClick}
            aria-label="戻る"
            size="lg"
            variant="primary-gold"
          />
        )}
        <h2 className="text-lg font-bold text-text-primary">
          {title}
        </h2>
      </div>
      <IconButton
        icon={<X className="w-6 h-6" />}
        onClick={onClose}
        aria-label="閉じる"
        size="lg"
        variant="primary-gold"
      />
    </div>
  );
};
