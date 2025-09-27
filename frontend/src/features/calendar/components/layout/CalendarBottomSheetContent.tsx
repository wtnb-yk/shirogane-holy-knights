'use client';

import React from 'react';
import { EventType } from '../../types';
import { EventTypePresetsSection } from '@/components/common/EventTypePresetsSection';

interface CalendarBottomSheetContentProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  eventTypes: EventType[];
}

export function CalendarBottomSheetContent({
  selectedEventTypes,
  onEventTypeChange,
  eventTypes
}: CalendarBottomSheetContentProps) {
  return (
    <EventTypePresetsSection
      selectedEventTypes={selectedEventTypes}
      onEventTypeChange={onEventTypeChange}
      eventTypes={eventTypes}
    />
  );
}
