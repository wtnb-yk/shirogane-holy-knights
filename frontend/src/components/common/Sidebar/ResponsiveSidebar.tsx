'use client';

import React from 'react';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  mobileContent: React.ReactNode;
  bottomSheetTitle?: string;
  className?: string;
}

export const ResponsiveSidebar = ({
  isOpen,
  onClose,
  children,
  mobileContent,
  bottomSheetTitle = '検索・絞り込み',
  className,
}: ResponsiveSidebarProps) => {
  return (
    <>
      {/* デスクトップ版（lg以上）：通常のサイドバー */}
      <div className="hidden lg:block">
        {children}
      </div>

      {/* モバイル版（lg未満）：BottomSheet */}
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        className={className}
        title={bottomSheetTitle}
      >
        {mobileContent}
      </BottomSheet>
    </>
  );
};
