'use client';

import React, { ReactNode } from 'react';
import { useViewport } from '@/hooks/useViewport';
import { Modal } from '@/components/Modal/Modal';
import { BottomSheet } from '@/components/BottomSheet/BottomSheet';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: ReactNode;
  className?: string;
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export const ResponsiveModal = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  backButton
}: ResponsiveModalProps) => {
  const { isDesktop, isLoaded } = useViewport();

  // SSRハイドレーション対応：初回レンダリング時はデスクトップ表示
  // ハイドレーション完了後に適切な表示に切り替え
  const shouldUseModal = !isLoaded || isDesktop;

  if (shouldUseModal) {
    // デスクトップ表示：Modalコンポーネント使用
    return (
      <Modal
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        title={title}
        backButton={backButton}
      >
        <div className={className}>
          {children}
        </div>
      </Modal>
    );
  }

  // モバイル表示：BottomSheetコンポーネント使用
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
      backButton={backButton}
    >
      {children}
    </BottomSheet>
  );
};
