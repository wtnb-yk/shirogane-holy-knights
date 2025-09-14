'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarSidebar } from './CalendarSidebar';
import { EventDetailModal } from './EventDetailModal';
import { SearchResultsSummary } from '@/components/common/SearchResultsSummary';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { CalendarBottomSheetContent } from './CalendarBottomSheetContent';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function CalendarView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
    clearFilters
  } = useCalendar();

  const activeFiltersCount = (searchQuery ? 1 : 0) + selectedEventTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(false);
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
          白銀ノエル関連のイベントとグッズのスケジュールを確認できます。<br />
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

      {/* 検索結果サマリー */}
      <SearchResultsSummary
        searchQuery={searchQuery}
        totalCount={filteredEvents.length}
        onClearAllFilters={clearFilters}
        hasFilters={hasActiveFilters}
        filters={{
          selectedTags: getSelectedEventTypeNames(),
        }}
      />

      {/* カレンダーグリッド */}
      <CalendarGrid
        currentView={currentView}
        currentDate={currentDate}
        events={filteredEvents}
        onEventClick={handleEventClick}
        onDateChange={setCurrentDate}
      />

      {/* イベント詳細モーダル */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
      />

      {/* モバイル用ボトムシート */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <BottomSheetHeader
          title="検索・絞り込み"
          onClose={() => setIsBottomSheetOpen(false)}
        />
        <CalendarBottomSheetContent
          currentView={currentView}
          onViewChange={setCurrentView}
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