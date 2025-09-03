'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownContent } from './DropdownContent';

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  mobileContent?: React.ReactNode;
  className?: string;
}

export const ResponsiveSidebar = ({
  isOpen,
  onClose,
  children,
  mobileContent,
  className,
}: ResponsiveSidebarProps) => {
  
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

  // ボディのスクロールを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* デスクトップ版（lg以上）：通常のサイドバー */}
      <div className="hidden lg:block">
        {children}
      </div>

      {/* モバイル版（lg未満）：ドロップダウンメニュー */}
      {isOpen && (
        <div className="lg:hidden">
          {/* 背景オーバーレイ */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* ドロップダウンメニュー */}
          <div
            className={cn(
              'absolute right-0 top-full mt-2 w-96 max-w-[95vw] bg-white shadow-lg border border-surface-border rounded-xl z-50',
              'animate-in slide-in-from-top-2 duration-200',
              className
            )}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-bg-secondary">
              <h2 className="text-lg font-bold text-text-primary">
                検索・絞り込み
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-text-tertiary hover:text-text-primary transition-colors rounded-md hover:bg-surface-hover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ドロップダウンコンテンツ */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <DropdownContent>
                {mobileContent || children}
              </DropdownContent>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
