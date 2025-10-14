'use client';

import React from 'react';
import { Event } from '../../../types';
import { EVENT_HEIGHT } from '../../../constants';
import { getEventColor } from '../../../utils/eventUtils';

interface CalendarEventItemProps {
  event: Event;
  onClick: (event: Event) => void;
}

export function CalendarEventItem({ event, onClick }: CalendarEventItemProps) {
  return (
    <button
      onClick={() => onClick(event)}
      data-event-item="true"
      style={{ height: `${EVENT_HEIGHT}px` }}
      className={`
        w-full text-left px-2 py-1 rounded text-xs font-medium
        border transition-colors duration-200
        truncate
        ${getEventColor(event)}
      `}
      title={event.title}
    >
      <span className="truncate">{event.title}</span>
    </button>
  );
}