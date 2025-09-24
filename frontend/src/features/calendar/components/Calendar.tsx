'use client';

import React from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarView, Event } from '../types';

interface CalendarProps {
  // Header関連props
  currentView: CalendarView;
  currentDate: Date;
  onDateChange: (date: Date) => void;

  // Grid関連props
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date, events: Event[]) => void;
  onMobileDateClick?: (date: Date, events: Event[]) => void;
}

export function Calendar(props: CalendarProps) {
  return (
    <>
      <CalendarHeader
        currentView={props.currentView}
        currentDate={props.currentDate}
        onDateChange={props.onDateChange}
      />
      <CalendarGrid
        currentView={props.currentView}
        currentDate={props.currentDate}
        events={props.events}
        loading={props.loading}
        error={props.error}
        onEventClick={props.onEventClick}
        onDateClick={props.onDateClick}
        onMobileDateClick={props.onMobileDateClick}
      />
    </>
  );
}