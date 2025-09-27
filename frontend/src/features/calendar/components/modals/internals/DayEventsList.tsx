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
  );
}
