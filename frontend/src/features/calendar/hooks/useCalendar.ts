'use client';

import { useState, useMemo } from 'react';
import { Event, CalendarView } from '../types';
import { mockEvents, eventTypes } from '../data/mockData';

export function useCalendar() {
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventTypes, setSelectedEventTypes] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // フィルタリングされたイベント
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents;

    // イベントタイプフィルター
    if (selectedEventTypes.length > 0) {
      filtered = filtered.filter(event =>
        event.eventTypes.some(type => selectedEventTypes.includes(type.id))
      );
    }

    // 検索クエリフィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedEventTypes, searchQuery]);

  // 現在の日付に基づいてイベントをフィルタリング
  const eventsForCurrentView = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (currentView === 'month') {
      return filteredEvents.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate.getFullYear() === currentYear &&
               eventDate.getMonth() === currentMonth;
      });
    }

    // 週表示・日表示の場合の処理（今回は月表示のみ実装）
    return filteredEvents;
  }, [filteredEvents, currentDate, currentView]);

  const clearFilters = () => {
    setSelectedEventTypes([]);
    setSearchQuery('');
  };

  return {
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    selectedEventTypes,
    setSelectedEventTypes,
    searchQuery,
    setSearchQuery,
    filteredEvents: eventsForCurrentView,
    selectedEvent,
    setSelectedEvent,
    isEventModalOpen,
    setIsEventModalOpen,
    eventTypes,
    clearFilters
  };
}
