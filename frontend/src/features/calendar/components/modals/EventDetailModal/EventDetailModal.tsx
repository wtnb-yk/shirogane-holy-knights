'use client';

import React from 'react';
import { Event } from '../../../types';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { useViewport } from '@/hooks/useViewport';
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
  const { isDesktop, isLoaded } = useViewport();

  if (!event) return null;

  // SSRハイドレーション対応：初回レンダリング時はデスクトップ表示
  const shouldUseDesktopLayout = !isLoaded || isDesktop;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={"イベント詳細"}
      className={shouldUseDesktopLayout ? "space-y-2 sm:space-y-3" : ""}
    >
      <EventDetailHeader
        fromDayModal={fromDayModal}
        onBackToDayModal={onBackToDayModal}
      />
      <EventTitle event={event} />
      <EventImage event={event} />
      <EventTimeInfo event={event} />
      <EventDescription event={event} />
    </ResponsiveModal>
  );
}
