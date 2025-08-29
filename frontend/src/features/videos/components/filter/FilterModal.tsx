'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VideoFilterSection, FilterOptions } from './VideoFilterSection';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableTags,
}: FilterModalProps) => {
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

  const handleReset = () => {
    setTempFilters({
      selectedTags: [],
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>フィルター設定</DialogTitle>
          <DialogClose onClose={() => handleOpenChange(false)} />
        </DialogHeader>
        <div className="p-6 pt-0">
          <VideoFilterSection
            filters={tempFilters}
            onFiltersChange={setTempFilters}
            availableTags={availableTags}
          />
          <div className="flex gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-text-secondary text-white rounded-md hover:bg-bg-accent/80 transition-colors"
            >
              適用
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-surface-border text-text-secondary rounded-md hover:bg-bg-accent transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
