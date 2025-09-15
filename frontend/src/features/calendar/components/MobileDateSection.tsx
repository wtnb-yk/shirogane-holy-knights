'use client';

import React from 'react';
import { Event } from '../types';
import { MobileEventCard } from './MobileEventCard';

interface MobileDateSectionProps {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onEventClick: (event: Event) => void;
}

export function MobileDateSection({
  date,
  events,
  isCurrentMonth,
  isToday,
  onEventClick
}: MobileDateSectionProps) {
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dayIndex = date.getDay();

  const eventsToShow = events.slice(0, 3);
  const remainingCount = events.length - 3;

  const getDateTextColor = () => {
    if (!isCurrentMonth) return 'text-text-muted';
    if (isToday) return 'text-text-inverse';
    if (dayIndex === 0) return 'text-red-500';
    if (dayIndex === 6) return 'text-accent-blue';
    return 'text-text-primary';
  };

  return (
    <div className={`
      border-b border-surface-border/20 py-2 px-3
      ${!isCurrentMonth ? 'opacity-50' : ''}
    `}>
      <div className={`
        flex items-center gap-2 mb-2
        ${isToday ? 'bg-accent-gold-light -mx-1 px-1 py-1 rounded' : ''}
      `}>
        <div className={`
          flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm
          ${isToday ? 'bg-accent-gold text-text-inverse' : 'bg-transparent'}
          ${getDateTextColor()}
        `}>
          {date.getDate()}
        </div>
        <span className={`text-xs font-medium ${getDateTextColor()}`}>
          ({dayOfWeek[dayIndex]})
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-text-secondary text-xs py-1 ml-8">
          予定なし
        </div>
      ) : (
        <div className="space-y-1 ml-8">
          {eventsToShow.map((event) => (
            <MobileEventCard
              key={event.id}
              event={event}
              onClick={onEventClick}
            />
          ))}
          {remainingCount > 0 && (
            <div className="text-text-secondary text-xs py-1 px-2 bg-bg-accent/5 rounded text-center">
              +{remainingCount}件
            </div>
          )}
        </div>
      )}
    </div>
  );
}
