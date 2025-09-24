'use client';

import React, { useState, useEffect } from 'react';
import { SearchOptionsModal } from '@/components/common/SearchOptionsModal/SearchOptionsModal';
import { CalendarFilterSection } from './CalendarFilterSection';
import { CalendarFilterOptions, EventType } from '../types';

interface CalendarSearchOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CalendarFilterOptions;
  onFiltersChange: (filters: CalendarFilterOptions) => void;
  eventTypes: EventType[];
}

export const CalendarSearchOptionsModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  eventTypes,
}: CalendarSearchOptionsModalProps) => {
  const [tempFilters, setTempFilters] = useState<CalendarFilterOptions>(filters);

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
      <CalendarFilterSection
        filters={tempFilters}
        onFiltersChange={setTempFilters}
        eventTypes={eventTypes}
      />
    </SearchOptionsModal>
  );
};