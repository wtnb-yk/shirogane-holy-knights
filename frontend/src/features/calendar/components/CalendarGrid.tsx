'use client';

import React from 'react';
import { CalendarView, Event } from '../types';
import { MonthView } from './MonthView';

interface CalendarGridProps {
  currentView: CalendarView;
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateChange: (date: Date) => void;
}

export function CalendarGrid({
  currentView,
  currentDate,
  events,
  onEventClick,
  onDateChange
}: CalendarGridProps) {
  if (currentView === 'month') {
    return (
      <MonthView
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onDateChange={onDateChange}
      />
    );
  }

  // 週表示・日表示は今回は実装しない
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      {currentView === 'week' ? '週表示' : '日表示'}は開発予定です
    </div>
  );
}