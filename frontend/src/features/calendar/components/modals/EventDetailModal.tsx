'use client';

import React from 'react';
import { Event } from '../../types';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { useViewport } from '@/hooks/useViewport';
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
      backButton={fromDayModal && onBackToDayModal ? {
        show: true,
        onClick: onBackToDayModal
      } : undefined}
    >
      <EventTitle event={event} />
      <EventImage event={event} />
      <EventTimeInfo event={event} />
      <EventDescription event={event} />
    </ResponsiveModal>
  );
}
