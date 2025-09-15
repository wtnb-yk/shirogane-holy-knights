'use client';

import React from 'react';
import { Event } from '../types';
import { CalendarEventItem } from './CalendarEventItem';

interface CalendarDateCellProps {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  onEventClick: (event: Event) => void;
}

export function CalendarDateCell({
  date,
  events,
  isCurrentMonth,
  isToday,
  isSunday,
  isSaturday,
  onEventClick
}: CalendarDateCellProps) {
  const eventsToShow = events.slice(0, 3);
  const remainingCount = events.length - 3;

  return (
    <div
      className={`
        min-h-[120px] p-2 border-r border-b border-surface-border/30 last:border-r-0
        ${!isCurrentMonth ? 'bg-bg-accent/10' : 'bg-bg-primary'}
        ${isToday ? 'bg-accent-gold-light' : ''}
        hover:bg-bg-accent/10 transition-colors duration-200 relative
      `}
    >
      <div className={`text-sm font-medium mb-2 ${
        !isCurrentMonth
          ? 'text-text-muted' :
        isToday
          ? 'text-text-inverse font-bold bg-accent-gold w-8 h-8 rounded-full flex items-center justify-center' :
        isSunday
          ? 'text-red-500' :
        isSaturday
          ? 'text-accent-blue'
          : 'text-text-primary'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {eventsToShow.map((event) => (
          <CalendarEventItem
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-text-secondary font-medium px-2 py-1">
            +{remainingCount}件
          </div>
        )}
      </div>
    </div>
  );
}