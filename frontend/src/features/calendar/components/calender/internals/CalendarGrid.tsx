'use client';

import React from 'react';
import { Event } from '../../../types';
import { MonthView } from './MonthView';

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date, events: Event[]) => void;
}

export function CalendarGrid({
  currentDate,
  events,
  loading,
  error,
  onEventClick,
  onDateClick,
}: CalendarGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <MonthView
      currentDate={currentDate}
      events={events}
      onEventClick={onEventClick}
      onDateClick={onDateClick}
    />
  );
}
