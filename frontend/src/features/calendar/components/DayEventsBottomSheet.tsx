'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { Event } from '../types';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { EventListItem } from './EventListItem';

interface DayEventsBottomSheetProps {
  date: Date | null;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function DayEventsBottomSheet({ date, events, isOpen, onClose, onEventClick }: DayEventsBottomSheetProps) {
  if (!date) return null;

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}月${day}日（${weekDay}）の予定`;
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a.eventTime && b.eventTime) {
      return a.eventTime.localeCompare(b.eventTime);
    }
    if (a.eventTime) return -1;
    if (b.eventTime) return 1;
    return 0;
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheetHeader
        title={
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-text-secondary" />
            <span>{formatDate(date)}</span>
          </div>
        }
        onClose={onClose}
      />

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