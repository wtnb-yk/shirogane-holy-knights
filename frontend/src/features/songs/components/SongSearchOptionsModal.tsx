'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>検索オプション</DialogTitle>
          <DialogClose onClose={() => handleOpenChange(false)} />
        </DialogHeader>
        <div className="p-6 pt-0">
          
          <div className="space-y-6">
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
          </div>
          
          <div className="mt-6 pt-4 border-t border-surface-border flex gap-3">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-text-secondary/90 transition-colors"
            >
              適用
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
