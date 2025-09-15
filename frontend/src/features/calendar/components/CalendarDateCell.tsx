'use client';

import React from 'react';
import { Event } from '../types';
import { CalendarEventItem } from './CalendarEventItem';

interface CalendarDateCellProps {
  date: Date;
  events: Event[];
  hiddenEvents?: Event[];
  bandReservedHeight?: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  onEventClick: (event: Event) => void;
}

export function CalendarDateCell({
  date,
  events,
  hiddenEvents = [],
  bandReservedHeight = 0,
  isCurrentMonth,
  isToday,
  isSunday,
  isSaturday,
  onEventClick
}: CalendarDateCellProps) {
  // eventsはすでに表示可能なイベントのみが渡される
  const eventsToShow = events;
  const remainingCount = hiddenEvents.length;


  return (
    <div
      className={`
        h-[140px] p-2 border-r border-b border-surface-border/30 last:border-r-0
        ${!isCurrentMonth ? 'bg-bg-accent/10' : 'bg-bg-primary'}
        ${isToday ? 'bg-accent-gold-light' : ''}
        hover:bg-bg-accent/10 transition-colors duration-200 relative overflow-hidden
      `}
    >
      {/* 日付と+N件を横並びに配置 */}
      <div className="flex justify-between items-center h-8">
        <div className={`text-sm font-medium ${
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
        {remainingCount > 0 && (
          <div className="text-xs text-text-secondary font-medium">
            +{remainingCount}件
          </div>
        )}
      </div>

      <div
        className="space-y-1"
        style={{ paddingTop: `${bandReservedHeight}px` }}
      >
        {/* 単日イベントの通常表示 */}
        {eventsToShow.map((event) => (
          <CalendarEventItem
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}