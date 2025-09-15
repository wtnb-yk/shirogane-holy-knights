'use client';

import { useState, useEffect } from 'react';
import { EventTypeDto } from '../types';
import { CalendarClient } from '../api/calendarClient';

interface UseCalendarEventTypesResult {
  eventTypes: EventTypeDto[];
  loading: boolean;
  error: string | null;
}

/**
 * イベントタイプ一覧取得のフック
 */
export const useCalendarEventTypes = (): UseCalendarEventTypesResult => {
  const [eventTypes, setEventTypes] = useState<EventTypeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await CalendarClient.getEventTypes();
        setEventTypes(result);
      } catch (err) {
        setError('イベントタイプの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  return {
    eventTypes,
    loading,
    error,
  };
};