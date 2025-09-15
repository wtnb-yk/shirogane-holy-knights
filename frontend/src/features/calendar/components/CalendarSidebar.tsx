'use client';

import React from 'react';
import { EventType } from '../types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { CalendarTypeSection } from './CalendarSidebar/CalendarTypeSection';

interface CalendarSidebarConfig {
  width?: 'sm' | 'md' | 'lg' | string;
}

interface CalendarSidebarProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  eventTypes: EventType[];
  config?: CalendarSidebarConfig;
}

export const CalendarSidebar = ({
  selectedEventTypes,
  onEventTypeChange,
  eventTypes,
  config = {}
}: CalendarSidebarProps) => {
  const {
    width = 'lg'
  } = config;

  const sections: SidebarSectionConfig[] = [
    {
      id: 'calendar-types',
      component: CalendarTypeSection,
      props: {
        selectedEventTypes,
        onEventTypeChange,
        eventTypes
      }
    }
  ];

  return (
    <FilterableSidebar
      sections={sections}
      width={width}
    />
  );
};
