'use client';

import React from 'react';
import { Event } from '../types';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { EventListItem } from './EventListItem';
import { formatDateShort } from '../utils/formatters';
import { sortEventsByTime } from '../utils/eventSortUtils';

interface DayEventsBottomSheetProps {
  date: Date | null;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function DayEventsBottomSheet({date, events, isOpen, onClose, onEventClick}: DayEventsBottomSheetProps) {
  if (!date) return null;

  const formatDateWithTitle = (date: Date) => {
    return `${formatDateShort(date)}の予定`;
  };

  const sortedEvents = sortEventsByTime(events);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={formatDateWithTitle(date)}>
      <div className="px-4 pb-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            この日の予定はありません
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-text-secondary mb-3 pt-4">
              {sortedEvents.length}件の予定
            </div>

            {sortedEvents.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
