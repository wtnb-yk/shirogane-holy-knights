'use client';

import React from 'react';
import { Event } from '../../../types';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { DayEventsHeader } from './DayEventsHeader';
import { DayEventsList } from './DayEventsList';
import { EmptyEventsMessage } from './EmptyEventsMessage';

interface DayEventsModalProps {
  date: Date | null;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function DayEventsModal({ date, events, isOpen, onClose, onEventClick }: DayEventsModalProps) {
  if (!date) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <DayEventsHeader date={date} />
        {events.length === 0 ? (
          <EmptyEventsMessage />
        ) : (
          <DayEventsList events={events} onEventClick={onEventClick} />
        )}
      </ModalContent>
    </Modal>
  );
}