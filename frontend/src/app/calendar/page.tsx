'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import { CalendarGrid } from '@/features/calendar/components/CalendarGrid';
import { CalendarSidebar } from '@/features/calendar/components/CalendarSidebar';
import { EventDetailModal } from '@/features/calendar/components/EventDetailModal';
import { DayEventsModal } from '@/features/calendar/components/DayEventsModal';
import { SearchResultsSummary } from '@/components/common/SearchResultsSummary';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { CalendarBottomSheetContent } from '@/features/calendar/components/CalendarBottomSheetContent';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function CalendarPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);

  const {
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    selectedEventTypes,
    setSelectedEventTypes,
    searchQuery,
    setSearchQuery,
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

  const activeFiltersCount = (searchQuery ? 1 : 0) + selectedEventTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDateClick = (date: Date, events: any[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(events);
    setIsDayEventsModalOpen(true);
  };

  const handleEventClickFromDayModal = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleBackToDayModal = () => {
    setIsEventModalOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(false);
    setIsDayEventsModalOpen(false);
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
          白銀ノエルさん関連のイベントとグッズ等のスケジュールを確認できます。<br />
          イベントタイプやキーワードで絞り込んで、見逃したくない情報をチェックしましょう。
        </p>
      }
      headerActions={
        <div className="lg:hidden ml-4 relative">
          <MobileSidebarButton
            onClick={() => setIsBottomSheetOpen(true)}
            hasActiveFilters={hasActiveFilters}
            activeFiltersCount={activeFiltersCount}
            variant="search"
          />
        </div>
      }
      mobileActions={
        <MobileSidebarButton
          onClick={() => setIsBottomSheetOpen(true)}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          variant="search"
        />
      }
      sidebar={
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <CalendarSidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            selectedEventTypes={selectedEventTypes}
            onEventTypeChange={setSelectedEventTypes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            eventTypes={eventTypes}
          />
        </ResponsiveSidebar>
      }
    >
      <BreadcrumbSchema items={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'カレンダー', url: 'https://www.noe-room.com/calendar' }
      ]} />

      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      <SearchResultsSummary
        searchQuery={searchQuery}
        totalCount={filteredEvents.length}
        onClearAllFilters={clearFilters}
        hasFilters={hasActiveFilters}
        filters={{
          selectedTags: getSelectedEventTypeNames(),
        }}
      />

      <CalendarGrid
        currentView={currentView}
        currentDate={currentDate}
        events={filteredEvents}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
        onDateChange={setCurrentDate}
        onDateClick={handleDateClick}
      />

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
        fromDayModal={isDayEventsModalOpen}
        onBackToDayModal={handleBackToDayModal}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <BottomSheetHeader
          title="検索・絞り込み"
          onClose={() => setIsBottomSheetOpen(false)}
        />
        <CalendarBottomSheetContent
          selectedEventTypes={selectedEventTypes}
          onEventTypeChange={setSelectedEventTypes}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          eventTypes={eventTypes}
        />
      </BottomSheet>
    </PageLayout>
  );
}
