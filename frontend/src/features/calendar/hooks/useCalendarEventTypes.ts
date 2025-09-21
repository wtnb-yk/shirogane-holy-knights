'use client';

import { EventTypeDto } from '../types';
import { CalendarApi } from '../api/calendarClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseCalendarEventTypesResult {
  eventTypes: EventTypeDto[];
  loading: boolean;
  error: string | null;
}

/**
 * イベントタイプ一覧取得のフック
 */
export const useCalendarEventTypes = (): UseCalendarEventTypesResult => {
  const { data, loading, error } = useApiQuery(CalendarApi.getEventTypes, {}, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    eventTypes: data || [],
    loading,
    error: error?.message || null,
  };
};