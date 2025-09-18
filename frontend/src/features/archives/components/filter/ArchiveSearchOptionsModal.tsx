'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalClose, ModalBody } from '@/components/ui/modal';
import { ArchiveFilterSection, FilterOptions } from './ArchiveFilterSection';

interface SearchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export const ArchiveSearchOptionsModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableTags,
}: SearchOptionsModalProps) => {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // モーダルが開かれたときに現在のフィルターを一時状態にコピー
  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);


  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTempFilters(filters);
      onClose();
    }
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };


  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>検索オプション</ModalTitle>
          <ModalClose onClose={() => handleOpenChange(false)} />
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <ArchiveFilterSection
              filters={tempFilters}
              onFiltersChange={setTempFilters}
              availableTags={availableTags}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-surface-border flex gap-3">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-text-secondary/90 transition-colors"
            >
              適用
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
