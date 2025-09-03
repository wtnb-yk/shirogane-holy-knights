'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { VideoFilterSection, FilterOptions } from './VideoFilterSection';

interface SearchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export const SearchOptionsModal = ({
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>検索オプション</DialogTitle>
          <DialogClose onClose={() => handleOpenChange(false)} />
        </DialogHeader>
        <div className="p-6 pt-0">
          
          <div className="space-y-6">
            <VideoFilterSection
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
