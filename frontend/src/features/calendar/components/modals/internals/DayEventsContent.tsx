'use client';

import React from 'react';
import { Event } from '../../../types';
import { DayEventsList } from './DayEventsList';
import { EmptyEventsMessage } from './EmptyEventsMessage';

export interface DayEventsContentProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function DayEventsContent({ events, onEventClick }: DayEventsContentProps) {
  return (
    <div className="space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
      {events.length === 0 ? (
        <EmptyEventsMessage />
      ) : (
        <DayEventsList events={events} onEventClick={onEventClick} />
      )}
    </div>
  );
}