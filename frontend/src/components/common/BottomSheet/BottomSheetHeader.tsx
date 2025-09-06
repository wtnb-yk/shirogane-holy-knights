'use client';

import React from 'react';
import { X } from 'lucide-react';

interface BottomSheetHeaderProps {
  title: string;
  onClose: () => void;
  showDragHandle?: boolean;
}

export const BottomSheetHeader = ({
  title,
  onClose,
  showDragHandle = true,
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
      <div className="flex items-center justify-between px-4 pb-3 border-b border-surface-border bg-white">
        <h2 className="text-lg font-bold text-text-primary">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-text-tertiary hover:text-text-primary transition-colors rounded-md hover:bg-surface-hover"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};