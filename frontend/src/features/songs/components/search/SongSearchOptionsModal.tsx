'use client';

import React, { useState, useEffect } from 'react';
import { SearchOptionsModal } from '@/components/Modal/SearchOptionsModal';
import { SortBy, SortOrder, SongFilterOptions } from '@/features/songs/types/types';
import { SongSortSection } from './internals/SongSortSection';
import { SongFilterSection } from './internals/SongFilterSection';

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

  const handleClose = () => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setTempFilters(filters);
    onClose();
  };


  return (
    <SearchOptionsModal
      isOpen={isOpen}
      onClose={handleClose}
      onApply={handleApply}
    >
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
    </SearchOptionsModal>
  );
};
