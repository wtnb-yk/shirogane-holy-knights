'use client';

import React from 'react';
import { Event } from '../../types';
import { DynamicResponsiveModal } from '@/components/Misc';
import { useViewport } from '@/hooks/useViewport';
import { DayEventsList } from '@/features/calendar/components/modals/internals/DayEventsList';
import { EmptyEventsMessage } from '@/features/calendar/components/modals/internals/EmptyEventsMessage';

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
    <DynamicResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${date.toLocaleDateString('ja-JP')}のイベント`}
      className={shouldUseDesktopLayout ? "space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" : ""}
    >
      {events.length === 0 ? (
        <EmptyEventsMessage />
      ) : (
        <DayEventsList events={events} onEventClick={onEventClick} />
      )}
    </DynamicResponsiveModal>
  );
}
