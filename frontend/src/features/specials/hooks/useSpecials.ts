import { useState, useEffect } from 'react';
import { SpecialEventDto } from '../types/types';
import { SpecialApi } from '../api/specialClient';
import { ApiError } from '@/utils/apiClient';

interface UseSpecialsReturn {
  events: SpecialEventDto[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * スペシャルイベント管理用カスタムフック
 * 既存のディスコグラフィーフックパターンに従う
 */
export const useSpecials = (): UseSpecialsReturn => {
  const [events, setEvents] = useState<SpecialEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SpecialApi.getSpecialEvents();
      setEvents(response.items);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err && 'type' in err) {
        setError(err as ApiError);
      } else {
        setError({
          message: err instanceof Error ? err.message : 'Failed to fetch special events',
          type: 'client'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};