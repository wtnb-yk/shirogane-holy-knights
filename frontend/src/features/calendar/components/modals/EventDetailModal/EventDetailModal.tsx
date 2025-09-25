'use client';

import React from 'react';
import { Event } from '../../../types';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { EventDetailHeader } from './EventDetailHeader';
import { EventTitle } from './EventTitle';
import { EventImage } from './EventImage';
import { EventTimeInfo } from './EventTimeInfo';
import { EventDescription } from './EventDescription';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  fromDayModal?: boolean;
  onBackToDayModal?: () => void;
}

export function EventDetailModal({ event, isOpen, onClose, fromDayModal = false, onBackToDayModal }: EventDetailModalProps) {
  if (!event) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <EventDetailHeader
          fromDayModal={fromDayModal}
          onBackToDayModal={onBackToDayModal}
        />
        <div className="space-y-4 px-4 pt-2 pb-4">
          <EventTitle event={event} />
          <EventImage event={event} />
          <EventTimeInfo event={event} />
          <EventDescription event={event} />
        </div>
      </ModalContent>
    </Modal>
  );
}