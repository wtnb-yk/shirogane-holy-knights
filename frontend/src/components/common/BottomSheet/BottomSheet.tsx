'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BottomSheetHeader } from '@/components';
import { BottomSheetOverlay } from '@/components/ui/Overlay';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';
import { useViewportHeight } from '@/hooks/useViewportHeight';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: ReactNode;
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  backButton,
}: BottomSheetProps) => {
  const { getMaxHeight, isLoaded } = useViewportHeight();

  // ESCキーハンドリングとpointerEvents制御は共通Overlayで処理

  if (!isOpen) return null;

  // ヘッダー分（約64px）を差し引いた高さを動的に計算
  const maxHeight = isLoaded ? getMaxHeight(64) : 'calc(var(--viewport-height) - 64px)';

  return (
    <>
      {/* 背景オーバーレイ */}
      <BottomSheetOverlay
        isOpen={isOpen}
        onClose={onClose}
      />

      {/* BottomSheetメニュー */}
      <div
        className={cn(
          `fixed bottom-0 left-0 right-0 w-full bg-white shadow-2xl ${TAILWIND_Z_INDEX.CONTENT.BOTTOM_SHEET}`,
          'rounded-t-3xl',
          'animate-in slide-in-from-bottom-2 duration-300',
          'flex flex-col',
          'overflow-hidden',
          className
        )}
        style={{
          pointerEvents: 'auto',
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
        }}
      >
        <BottomSheetHeader
          title={title}
          onClose={onClose}
          backButton={backButton}
        />
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
