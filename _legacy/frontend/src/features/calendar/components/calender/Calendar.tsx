'use client';

import React from 'react';
import { CalendarHeader } from './internals/CalendarHeader';
import { CalendarGrid } from './internals/CalendarGrid';
import { Event } from '../../types';

interface CalendarProps {
  // Header関連props
  currentDate: Date;
  onDateChange: (date: Date) => void;

  // Grid関連props
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date, events: Event[]) => void;
}

export function Calendar(props: CalendarProps) {
  return (
    <>
      <CalendarHeader
        currentDate={props.currentDate}
        onDateChange={props.onDateChange}
      />
      <CalendarGrid
        currentDate={props.currentDate}
        events={props.events}
        loading={props.loading}
        error={props.error}
        onEventClick={props.onEventClick}
        onDateClick={props.onDateClick}
      />
    </>
  );
}
