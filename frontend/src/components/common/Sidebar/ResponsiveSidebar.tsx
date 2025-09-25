'use client';

import React from 'react';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { GenericSidebar } from './internals/GenericSidebar';

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  desktopContent: React.ReactNode;
  mobileContent: React.ReactNode;
  bottomSheetTitle?: string;
  className?: string;
  sidebarClassName?: string;
}

export const ResponsiveSidebar = ({
  isOpen,
  onClose,
  desktopContent,
  mobileContent,
  bottomSheetTitle = '検索・絞り込み',
  className,
  sidebarClassName,
}: ResponsiveSidebarProps) => {
  return (
    <>
      {/* デスクトップ版（lg以上）：GenericSidebarでラップ */}
      <div className="hidden lg:block">
        <GenericSidebar className={sidebarClassName}>
          {desktopContent}
        </GenericSidebar>
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
