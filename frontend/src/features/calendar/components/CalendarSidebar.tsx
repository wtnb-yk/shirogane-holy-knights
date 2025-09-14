'use client';

import React from 'react';
import { EventType, CalendarView } from '../types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { ContentTypeTabs } from '@/components/common/Sidebar/components/ContentTypeTabs';
import { CalendarSearchSection } from './CalendarSidebar/CalendarSearchSection';
import { CalendarTypeSection } from './CalendarSidebar/CalendarTypeSection';

interface CalendarSidebarConfig {
  searchSection?: {
    title?: string;
  };
  width?: 'sm' | 'md' | 'lg' | string;
}

interface CalendarSidebarProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  eventTypes: EventType[];
  config?: CalendarSidebarConfig;
}

export const CalendarSidebar = ({
  currentView,
  onViewChange,
  selectedEventTypes,
  onEventTypeChange,
  searchQuery,
  onSearchChange,
  eventTypes,
  config = {}
}: CalendarSidebarProps) => {
  const {
    searchSection = {
      title: 'イベント検索'
    },
    width = 'lg'
  } = config;

  const handleSearch = (query: string) => {
    onSearchChange(query);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const viewTabs = [
    { value: 'month', label: '月' },
    { value: 'week', label: '週' },
    { value: 'day', label: '日' }
  ];

  const sections: SidebarSectionConfig[] = [
    {
      id: 'view-tabs',
      component: ContentTypeTabs,
      props: {
        tabs: viewTabs,
        activeTab: currentView,
        onTabChange: onViewChange
      }
    },
    {
      id: 'calendar-search',
      component: CalendarSearchSection,
      props: {
        searchValue: searchQuery,
        onSearch: handleSearch,
        onClearSearch: handleClearSearch,
        title: searchSection.title
      }
    },
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