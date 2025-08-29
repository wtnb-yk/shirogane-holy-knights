'use client';

import { useState, useEffect } from 'react';
import { SongClient } from '../api/songClient';
import { 
  StreamSong, 
  SortBy, 
  SortOrder,
  SongFilterOptions
} from '../types/types';

interface UseStreamSongsQueryOptions {
  pageSize?: number;
}

interface UseStreamSongsQueryState {
  currentPage: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
}

interface UseStreamSongsQueryResult {
  songs: StreamSong[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export const useStreamSongsQuery = (
  options: UseStreamSongsQueryOptions,
  state: UseStreamSongsQueryState
): UseStreamSongsQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, sortBy, sortOrder, filters } = state;

  const [songs, setSongs] = useState<StreamSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await SongClient.callStreamSongsSearchFunction({
          query: searchQuery || undefined,
          sortBy,
          sortOrder,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: currentPage,
          size: pageSize,
        });
        
        setSongs(result.songs);
        setTotalCount(result.totalCount);
      } catch (err: any) {
        console.error('楽曲検索エラー:', err);
        setError(err.error || '楽曲の取得に失敗しました');
        setSongs([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [currentPage, pageSize, searchQuery, sortBy, sortOrder, filters.startDate, filters.endDate]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasMore = currentPage * pageSize < totalCount;

  return {
    songs,
    loading,
    error,
    totalCount,
    totalPages,
    hasMore,
  };
};