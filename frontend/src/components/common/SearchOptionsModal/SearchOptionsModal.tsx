'use client';

import React from 'react';
import { SkeletonModal, SkeletonModalContent } from '@/components/ui/SkeletonModal';
import { ModalButton } from '@/components/ui/ModalButton';

interface SearchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  title?: string;
  children: React.ReactNode;
}

export const SearchOptionsModal = ({
  isOpen,
  onClose,
  onApply,
  title = '検索オプション',
  children
}: SearchOptionsModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <SkeletonModal open={isOpen} onOpenChange={handleOpenChange}>
      <SkeletonModalContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {children}

        <div className="flex justify-center">
          <ModalButton onClick={onApply}>
            適用
          </ModalButton>
        </div>
      </SkeletonModalContent>
    </SkeletonModal>
  );
};
