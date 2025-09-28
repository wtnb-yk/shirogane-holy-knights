'use client';

import React from 'react';
import { Event } from '../../types';
import { DynamicResponsiveModal } from '@/components/Misc';
import { EventTitle } from './internals/EventTitle';
import { EventImage } from './internals/EventImage';
import { EventTimeInfo } from './internals/EventTimeInfo';
import { EventDescription } from './internals/EventDescription';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  fromDayModal?: boolean;
  onBackToDayModal?: () => void;
}

export function EventDetailModal({ event, isOpen, onClose, fromDayModal = false, onBackToDayModal }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <DynamicResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={"イベント詳細"}
      backButton={fromDayModal && onBackToDayModal ? {
        show: true,
        onClick: onBackToDayModal
      } : undefined}
    >
      <div className="space-y-2">
        <EventTitle event={event} />
        <EventImage event={event} />
        <EventTimeInfo event={event} />
        <EventDescription event={event} />
      </div>
    </DynamicResponsiveModal>
  );
}
