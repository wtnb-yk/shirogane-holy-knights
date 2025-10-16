'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { CalendarSearchResultsSummary } from '@/features/calendar/components/results/CalendarSearchResultsSummary';
import { FilterToggleButton } from '@/components/Button/FilterToggleButton';
import { PageLayout } from '@/components/Layout/PageLayout';
import { CalendarSidebarContent } from "@/features/calendar/components/layout/CalendarSidebarContent";
import { CalendarBottomSheetContent } from "@/features/calendar/components/layout/CalendarBottomSheetContent";
import { Calendar } from "@/features/calendar/components/calender/Calendar";
import { CalendarModalContentContainer, CalendarModalMode } from "@/features/calendar/components/modals/internals/CalendarModalContentContainer";
import { ResponsiveModal } from "@/components/Modal";

export default function CalendarPage() {
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarModalMode, setCalendarModalMode] = useState<CalendarModalMode>('dayEvents');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [fromDayModalOrSheet, setFromDayModalOrSheet] = useState(false);

  const {
    currentDate,
    setCurrentDate,
    selectedEventTypes,
    setSelectedEventTypes,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    eventTypes,
    loading,
    error,
    clearFilters
  } = useCalendar();

  const activeFiltersCount = selectedEventTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setCalendarModalMode('eventDetail');
    setCalendarModalOpen(true);
    setFromDayModalOrSheet(false);
  };

  const handleDateClick = (date: Date, events: any[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(events);
    setCalendarModalMode('dayEvents');
    setCalendarModalOpen(true);
  };

  const handleEventClickFromDayModal = (event: any) => {
    setSelectedEvent(event);
    setCalendarModalMode('eventDetail');
    setFromDayModalOrSheet(true);
  };

  const handleBackToDayModal = () => {
    setCalendarModalMode('dayEvents');
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setCalendarModalOpen(false);
    setSelectedDate(null);
    setSelectedDateEvents([]);
    setFromDayModalOrSheet(false);
  };

  const selectedEventTypeObjects = eventTypes.filter(type => selectedEventTypes.includes(type.id));

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
        selectedEventTypes={selectedEventTypeObjects}
      />

      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        events={filteredEvents}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />

      {/* 統合モーダル */}
      <ResponsiveModal
        isOpen={calendarModalOpen}
        onClose={handleCloseModal}
        title={calendarModalMode === 'dayEvents'
          ? `${selectedDate?.toLocaleDateString('ja-JP')}のイベント`
          : 'イベント詳細'
        }
        backButton={calendarModalMode === 'eventDetail' && fromDayModalOrSheet ? {
          show: true,
          onClick: handleBackToDayModal
        } : undefined}
        mobileVariant="fullScreen"
      >
        <CalendarModalContentContainer
          mode={calendarModalMode}
          events={selectedDateEvents}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClickFromDayModal}
        />
      </ResponsiveModal>
    </PageLayout>
  );
}
