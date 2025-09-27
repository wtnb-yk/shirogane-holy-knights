'use client';

import React, { useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BottomSheetHeader } from '@/components';
import { BottomSheetOverlay } from '@/components/ui/Overlay';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

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

  // ESCキーハンドリングは共通Overlayで処理

  // クリックイベントを制御（スクロール制御は共通Overlayで処理）
  useEffect(() => {
    if (isOpen) {
      // すべてのクリックイベントを一時的に無効化（BottomSheet以外）
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
          'max-h-[calc(100vh-64px)]',
          'overflow-hidden',
          className
        )}
        style={{ pointerEvents: 'auto' }}
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
