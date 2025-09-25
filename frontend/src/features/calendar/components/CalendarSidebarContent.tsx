'use client';

import React from 'react';
import { EventType } from '../types';
import { EventTypePresetsSection } from "@/components/common/EventTypePresetsSection";

interface CalendarSidebarContentConfig {}

interface CalendarSidebarContentProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  eventTypes: EventType[];
  config?: CalendarSidebarContentConfig;
}

export const CalendarSidebarContent = ({
  selectedEventTypes,
  onEventTypeChange,
  eventTypes,
  config = {}
}: CalendarSidebarContentProps) => {
  const {} = config;

  return (
    <EventTypePresetsSection
      selectedEventTypes={selectedEventTypes}
      onEventTypeChange={onEventTypeChange}
      eventTypes={eventTypes}
    />
  );
};
