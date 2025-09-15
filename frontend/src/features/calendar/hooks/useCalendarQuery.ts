'use client';

import { useState, useEffect } from 'react';
import { EventDto, CalendarFilterOptions } from '../types';
import { CalendarClient } from '../api/calendarClient';

interface UseCalendarQueryOptions {
  pageSize: number;
}

interface UseCalendarQueryParams {
  currentPage: number;
  filters: CalendarFilterOptions;
}

interface UseCalendarQueryResult {
  events: EventDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * カレンダーAPI呼び出しのフック
 */
export const useCalendarQuery = (
  options: UseCalendarQueryOptions,
  params: UseCalendarQueryParams
): UseCalendarQueryResult => {
  const { pageSize } = options;
  const { currentPage, filters } = params;

  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await CalendarClient.searchCalendar({
          eventTypeIds: filters.eventTypeIds,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: currentPage,
          pageSize,
        });

        setEvents(result.items);
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
      } catch (err) {
        setError('カレンダーの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, filters.eventTypeIds, filters.startDate, filters.endDate, pageSize]);

  return {
    events,
    loading,
    error,
    totalCount,
    hasMore,
  };
};
