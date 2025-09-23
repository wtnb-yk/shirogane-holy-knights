'use client';

import React, { useState, useEffect } from 'react';
import { SearchOptionsModal } from '@/components/common/SearchOptionsModal/SearchOptionsModal';
import { ArchiveFilterSection, FilterOptions } from './internals/ArchiveFilterSection';

interface ArchiveSearchOptionsModalProps {
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
}: ArchiveSearchOptionsModalProps) => {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // モーダルが開かれたときに現在のフィルターを一時状態にコピー
  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);


  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClose = () => {
    setTempFilters(filters);
    onClose();
  };


  return (
    <SearchOptionsModal
      isOpen={isOpen}
      onClose={handleClose}
      onApply={handleApply}
    >
      <ArchiveFilterSection
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        availableTags={availableTags}
      />
    </SearchOptionsModal>
  );
};
