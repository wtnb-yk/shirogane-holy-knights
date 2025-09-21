'use client';

import React, { useState, useEffect } from 'react';
import { SkeletonModal, SkeletonModalContent } from '@/components/ui/skeleton-modal';
import { ModalButton } from '@/components/ui/ModalButton';
import { SortBy, SortOrder, SongFilterOptions } from '../types/types';
import { SongSortSection } from './SongSortSection';
import { SongFilterSection } from './SongFilterSection';

interface SongSearchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onFiltersChange: (filters: SongFilterOptions) => void;
}

export const SongSearchOptionsModal = ({
  isOpen,
  onClose,
  sortBy,
  sortOrder,
  filters,
  onSortChange,
  onFiltersChange,
}: SongSearchOptionsModalProps) => {
  const [tempSortBy, setTempSortBy] = useState<SortBy>(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState<SortOrder>(sortOrder);
  const [tempFilters, setTempFilters] = useState<SongFilterOptions>(filters);

  // モーダルが開かれたときに現在の設定を一時状態にコピー
  useEffect(() => {
    if (isOpen) {
      setTempSortBy(sortBy);
      setTempSortOrder(sortOrder);
      setTempFilters(filters);
    }
  }, [isOpen, sortBy, sortOrder, filters]);

  const handleSortByChange = (newSortBy: SortBy) => {
    setTempSortBy(newSortBy);
  };

  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    setTempSortOrder(newSortOrder);
  };


  const handleApply = () => {
    onSortChange(tempSortBy, tempSortOrder);
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTempSortBy(sortBy);
      setTempSortOrder(sortOrder);
      setTempFilters(filters);
      onClose();
    }
  };


  return (
    <SkeletonModal open={isOpen} onOpenChange={handleOpenChange}>
      <SkeletonModalContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-lg font-semibold text-white">検索オプション</h2>

        <SongSortSection
          sortBy={tempSortBy}
          sortOrder={tempSortOrder}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <SongFilterSection
          filters={tempFilters}
          onFiltersChange={setTempFilters}
        />

        <div className="flex justify-center">
          <ModalButton onClick={handleApply}>
            適用
          </ModalButton>
        </div>
      </SkeletonModalContent>
    </SkeletonModal>
  );
};
