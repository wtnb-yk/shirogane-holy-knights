'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { Calendar } from '@/features/calendar/components/Calendar';
import { CalendarSidebar } from '@/features/calendar/components/CalendarSidebar';
import { EventDetailModal } from '@/features/calendar/components/modals/EventDetailModal';
import { DayEventsModal } from '@/features/calendar/components/modals/DayEventsModal';
import { DayEventsBottomSheet } from '@/features/calendar/components/DayEventsBottomSheet';
import { CalendarSearchResultsSummary } from '@/features/calendar/components/display/results/CalendarSearchResultsSummary';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { CalendarBottomSheetContent } from '@/features/calendar/components/CalendarBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function CalendarPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleEventClickFromBottomSheet = (event: any) => {
    setIsDayEventsBottomSheetOpen(false);
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
      mobileActions={
        <FilterToggleButton
          onClick={() => setIsSidebarOpen(true)}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          variant="filter"
        />
      }
      sidebar={
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          mobileContent={
            <CalendarBottomSheetContent
              selectedEventTypes={selectedEventTypes}
              onEventTypeChange={setSelectedEventTypes}
              eventTypes={eventTypes}
            />
          }
        >
          <CalendarSidebar
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={setSelectedEventTypes}
            eventTypes={eventTypes}
          />
      </ResponsiveSidebar>
      }
    >
      <BreadcrumbSchema items={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'カレンダー', url: 'https://www.noe-room.com/calendar' }
      ]} />

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

      {/* TODO: モーダルとボトムシートのリファクタ */}
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

      {/*　TODO: 開くように修正する */}
      <DayEventsBottomSheet
        date={selectedDate}
        events={selectedDateEvents}
        isOpen={isDayEventsBottomSheetOpen}
        onClose={() => setIsDayEventsBottomSheetOpen(false)}
        onEventClick={handleEventClickFromBottomSheet}
      />
    </PageLayout>
  );
}
