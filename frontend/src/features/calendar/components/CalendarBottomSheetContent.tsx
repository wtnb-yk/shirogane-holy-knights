'use client';

import React from 'react';
import { CalendarSidebar } from './CalendarSidebar';
import { EventType, CalendarView } from '../types';

interface CalendarBottomSheetContentProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  eventTypes: EventType[];
}

export function CalendarBottomSheetContent({
  currentView,
  onViewChange,
  selectedEventTypes,
  onEventTypeChange,
  searchQuery,
  onSearchChange,
  eventTypes
}: CalendarBottomSheetContentProps) {
  return (
    <div className="px-4 pb-4">
      <CalendarSidebar
        currentView={currentView}
        onViewChange={onViewChange}
        selectedEventTypes={selectedEventTypes}
        onEventTypeChange={onEventTypeChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        eventTypes={eventTypes}
      />
    </div>
  );
}