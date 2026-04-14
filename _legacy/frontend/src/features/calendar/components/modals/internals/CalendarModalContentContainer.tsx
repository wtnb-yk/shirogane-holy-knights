'use client';

import React from 'react';
import { Event } from '../../../types';
import { ModalContentContainer, ModalContentItem } from '@/components/Modal/ModalContentContainer';
import { DayEventsContent } from './DayEventsContent';
import { EventDetailContent } from './EventDetailContent';

export type CalendarModalMode = 'dayEvents' | 'eventDetail';

export interface CalendarModalContentContainerProps {
  mode: CalendarModalMode;
  events: Event[];
  selectedEvent: Event | null;
  onEventClick: (event: Event) => void;
}

export function CalendarModalContentContainer({
  mode,
  events,
  selectedEvent,
  onEventClick,
}: CalendarModalContentContainerProps) {
  const contents: ModalContentItem<CalendarModalMode>[] = [
    {
      mode: 'dayEvents',
      transitionDirection: 'left',
      content: <DayEventsContent events={events} onEventClick={onEventClick} />,
    },
    {
      mode: 'eventDetail',
      transitionDirection: 'right',
      content: <EventDetailContent event={selectedEvent} />,
    },
  ];

  return <ModalContentContainer currentMode={mode} contents={contents} />;
}
