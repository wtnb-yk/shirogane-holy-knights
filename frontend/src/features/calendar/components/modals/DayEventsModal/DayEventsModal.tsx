'use client';

import React from 'react';
import { Event } from '../../../types';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { useViewport } from '@/hooks/useViewport';
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
  const { isDesktop, isLoaded } = useViewport();

  if (!date) return null;

  // SSRハイドレーション対応：初回レンダリング時はデスクトップ表示
  const shouldUseDesktopLayout = !isLoaded || isDesktop;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={shouldUseDesktopLayout ? `${date.toLocaleDateString('ja-JP')}のイベント` : ""}
      className={shouldUseDesktopLayout ? "space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" : ""}
    >
      <DayEventsHeader date={date} />
      {events.length === 0 ? (
        <EmptyEventsMessage />
      ) : (
        <DayEventsList events={events} onEventClick={onEventClick} />
      )}
    </ResponsiveModal>
  );
}