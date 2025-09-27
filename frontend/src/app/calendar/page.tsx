'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { EventDetailModal } from '@/features/calendar/components/modals/EventDetailModal';
import { DayEventsModal } from '@/features/calendar/components/modals/DayEventsModal';
import { CalendarSearchResultsSummary } from '@/features/calendar/components/results/CalendarSearchResultsSummary';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { PageLayout } from '@/components/common/PageLayout';
import {CalendarSidebarContent} from "@/features/calendar/components/layout/CalendarSidebarContent";
import {CalendarBottomSheetContent} from "@/features/calendar/components/layout/CalendarBottomSheetContent";
import {Calendar} from "@/features/calendar/components/calender/Calendar";

export default function CalendarPage() {
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [isDayEventsBottomSheetOpen, setIsDayEventsBottomSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [fromDayModalOrSheet, setFromDayModalOrSheet] = useState(false);

  const {
    currentView,
    currentDate,
    setCurrentDate,
    selectedEventTypes,
    setSelectedEventTypes,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    isEventModalOpen,
    setIsEventModalOpen,
    eventTypes,
    loading,
    error,
    clearFilters
  } = useCalendar();

  const activeFiltersCount = selectedEventTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setFromDayModalOrSheet(false);
  };

  const handleDateClick = (date: Date, events: any[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(events);
    setIsDayEventsModalOpen(true);
  };

  const handleMobileDateClick = (date: Date, events: any[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(events);
    setIsDayEventsBottomSheetOpen(true);
  };

  const handleEventClickFromDayModal = (event: any) => {
    setIsDayEventsModalOpen(false);
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setFromDayModalOrSheet(true);
  };

  const handleBackToDayModal = () => {
    setIsEventModalOpen(false);
    setIsDayEventsModalOpen(true);
  };

  const handleBackToBottomSheet = () => {
    setIsEventModalOpen(false);
    setIsDayEventsBottomSheetOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(false);
    setIsDayEventsModalOpen(false);
    setIsDayEventsBottomSheetOpen(false);
    setSelectedDate(null);
    setSelectedDateEvents([]);
    setFromDayModalOrSheet(false);
  };

  const getSelectedEventTypeNames = () => {
    return eventTypes
      .filter(type => selectedEventTypes.includes(type.id))
      .map(type => type.type === 'event' ? 'イベント' : 'グッズ');
  };

  return (
    <PageLayout
      title="CALENDAR"
      description={
        <p>
          白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。<br />
          カテゴリで絞り込んで、見逃したくない情報をチェックしましょう。
        </p>
      }
      breadcrumbItems={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'カレンダー', url: 'https://www.noe-room.com/calendar' }
      ]}
      desktopSidebar={{
        content: (
          <CalendarSidebarContent
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={setSelectedEventTypes}
            eventTypes={eventTypes}
          />
        )
      }}
      mobileBottomSheet={{
        trigger: (
          <FilterToggleButton
            onClick={() => setMobileBottomSheetOpen(true)}
            hasActiveFilters={hasActiveFilters}
            activeFiltersCount={activeFiltersCount}
            variant="filter"
          />
        ),
        isOpen: mobileBottomSheetOpen,
        onClose: () => setMobileBottomSheetOpen(false),
        title: '絞り込み',
        content: (
          <CalendarBottomSheetContent
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={setSelectedEventTypes}
            eventTypes={eventTypes}
          />
        )
      }}
    >
      <CalendarSearchResultsSummary
        searchQuery=""
        totalCount={filteredEvents.length}
        onClearAllFilters={clearFilters}
        hasFilters={hasActiveFilters}
        selectedEventTypeNames={getSelectedEventTypeNames()}
      />

      <Calendar
        currentView={currentView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        events={filteredEvents}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
        onMobileDateClick={handleMobileDateClick}
      />

      {/* 独立したモーダル群 */}
      <DayEventsModal
        date={selectedDate}
        events={selectedDateEvents}
        isOpen={isDayEventsModalOpen}
        onClose={() => setIsDayEventsModalOpen(false)}
        onEventClick={handleEventClickFromDayModal}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
        fromDayModal={fromDayModalOrSheet}
        onBackToDayModal={isDayEventsBottomSheetOpen ? handleBackToBottomSheet : handleBackToDayModal}
      />
    </PageLayout>
  );
}
