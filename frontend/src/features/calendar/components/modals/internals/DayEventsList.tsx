import React from 'react';
import { Event } from '../../../types';
import { EventListItem } from './EventListItem';
import { sortEventsByTime } from '../../../utils/eventSortUtils';

interface DayEventsListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function DayEventsList({ events, onEventClick }: DayEventsListProps) {
  const sortedEvents = sortEventsByTime(events);

  return (
    <div className="space-y-3">
      <div className="text-sm text-text-primary mb-3 font-medium">
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
  );
}
