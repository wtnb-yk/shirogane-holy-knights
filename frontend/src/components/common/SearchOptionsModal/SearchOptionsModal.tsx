'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
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
    <Modal open={isOpen} onOpenChange={handleOpenChange} title={title}>
      <div className="space-y-4 sm:space-y-6">
        {children}

        <div className="flex justify-center">
          <ModalButton onClick={onApply}>
            適用
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
};
