'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { Event } from '../types';
import { SkeletonModal, SkeletonModalContent } from '@/components/ui/SkeletonModal';
import { EventListItem } from './EventListItem';

interface DayEventsModalProps {
  date: Date | null;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: Event) => void;
}

export function DayEventsModal({ date, events, isOpen, onClose, onEventClick }: DayEventsModalProps) {
  if (!date) return null;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日（${weekDay}）`;
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a.eventTime && b.eventTime) {
      return a.eventTime.localeCompare(b.eventTime);
    }
    if (a.eventTime) return -1;
    if (b.eventTime) return 1;
    return 0;
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <SkeletonModal open={isOpen} onOpenChange={handleOpenChange}>
      <SkeletonModalContent className="p-4 sm:p-6 space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-2">
          <Calendar className="w-5 h-5 text-gray-300" />
          <h2 className="text-lg font-semibold text-white">{formatDate(date)}</h2>
        </div>
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-white">
            この日の予定はありません
          </div>
        ) : (
          <div className="space-y-3 px-4 pt-2 pb-4">
            <div className="text-sm text-gray-200 mb-3 font-medium">
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
      </SkeletonModalContent>
    </SkeletonModal>
  );
}
