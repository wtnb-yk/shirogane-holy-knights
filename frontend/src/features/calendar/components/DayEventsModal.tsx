'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { Event } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/modal';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-text-secondary" />
              <span>{formatDate(date)}</span>
            </div>
          </DialogTitle>
          <DialogClose onClose={onClose} />
        </DialogHeader>

        <div className="p-6 pt-0">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              この日の予定はありません
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-text-secondary mb-3">
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
      </DialogContent>
    </Dialog>
  );
}
