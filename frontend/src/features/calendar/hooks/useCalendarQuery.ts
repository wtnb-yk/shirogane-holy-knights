'use client';

import { useMemo } from 'react';
import { EventDto, CalendarFilterOptions, CalendarSearchParamsDto } from '../types';
import { CalendarApi } from '../api/calendarClient';
import { useApiQuery } from '@/hooks/useApi';

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

  // APIパラメータをメモ化
  const apiParams = useMemo((): CalendarSearchParamsDto => ({
    eventTypeIds: filters.eventTypeIds,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: currentPage,
    pageSize,
  }), [currentPage, filters.eventTypeIds, filters.startDate, filters.endDate, pageSize]);

  // 新しいAPIフックを使用
  const { data, loading, error } = useApiQuery(CalendarApi.search, apiParams, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    events: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
  };
};
