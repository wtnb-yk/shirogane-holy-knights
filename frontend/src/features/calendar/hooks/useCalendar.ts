'use client';

import { useState, useMemo } from 'react';
import { Event } from '../types';
import { useCalendarQuery } from './useCalendarQuery';
import { useCalendarEventTypes } from './useCalendarEventTypes';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventTypes, setSelectedEventTypes] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // 現在の月の開始日と終了日を取得（APIフィルタリング用）
  const currentMonthRange = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return {
      startDate: `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-${String(startOfMonth.getDate()).padStart(2, '0')}`,
      endDate: `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`
    };
  }, [currentDate]);

  // API呼び出し
  const { events, loading, error } = useCalendarQuery(
    { pageSize: 100 }, // 月表示なので全件取得
    {
      currentPage: 1,
      filters: {
        eventTypeIds: selectedEventTypes.length > 0 ? selectedEventTypes : undefined,
        startDate: currentMonthRange.startDate,
        endDate: currentMonthRange.endDate
      }
    }
  );

  const { eventTypes } = useCalendarEventTypes();

  // DTOからEvent型に変換
  const filteredEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      eventTypes: event.eventTypes.map(type => ({ id: type.id, type: type.type }))
    } as Event));
  }, [events]);

  const clearFilters = () => {
    setSelectedEventTypes([]);
  };

  return {
    currentDate,
    setCurrentDate,
    selectedEventTypes,
    setSelectedEventTypes,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    isEventModalOpen,
    setIsEventModalOpen,
    eventTypes: eventTypes.map(type => ({ id: type.id, type: type.type })),
    loading,
    error,
    clearFilters
  };
}
