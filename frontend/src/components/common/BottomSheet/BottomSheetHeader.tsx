'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetHeaderProps {
  title: ReactNode;
  onClose: () => void;
  showDragHandle?: boolean;
}

export const BottomSheetHeader = ({
  title,
  onClose,
  showDragHandle = false,
}: BottomSheetHeaderProps) => {
  return (
    <>
      {/* ドラッグハンドル */}
      {showDragHandle && (
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
      )}

      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-white">
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
    </>
  );
};
