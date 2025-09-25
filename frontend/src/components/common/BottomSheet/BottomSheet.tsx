'use client';

import React, { useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BottomSheetHeader } from '@/components';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: ReactNode;
  showDragHandle?: boolean;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  showDragHandle = false,
}: BottomSheetProps) => {

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // ボディのスクロールとクリックイベントを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // すべてのクリックイベントを一時的に無効化（BottomSheet以外）
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 z-50 bg-black/20"
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      />

      {/* BottomSheetメニュー */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 w-full bg-white shadow-2xl border-t border-surface-border rounded-t-xl z-[51]',
          'animate-in slide-in-from-bottom-2 duration-300',
          'flex flex-col',
          'max-h-[calc(100vh-64px)]',
          className
        )}
        style={{ pointerEvents: 'auto' }}
      >
        {title && (
          <BottomSheetHeader
            title={title}
            onClose={onClose}
            showDragHandle={showDragHandle}
          />
        )}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
