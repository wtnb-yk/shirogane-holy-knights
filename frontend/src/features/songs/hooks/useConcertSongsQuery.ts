'use client';

import { useState, useEffect } from 'react';
import { ConcertSongClient } from '../api/songClient';
import { ConcertSong, SortBy, SortOrder, SongFilterOptions } from '../types/types';

interface UseConcertSongsQueryOptions {
  pageSize?: number;
}

interface UseConcertSongsQueryParams {
  currentPage: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
}

interface UseConcertSongsQueryResult {
  songs: ConcertSong[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * コンサート楽曲データのAPI呼び出しを管理するhook
 * @param options API呼び出しのオプション
 * @param params 検索・フィルタパラメータ
 */
export const useConcertSongsQuery = (
  options: UseConcertSongsQueryOptions = {},
  params: UseConcertSongsQueryParams
): UseConcertSongsQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, sortBy, sortOrder, filters } = params;
  
  const [songs, setSongs] = useState<ConcertSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchConcertSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await ConcertSongClient.callConcertSongsSearchFunction({
          page: currentPage,
          size: pageSize,
          query: searchQuery || undefined,
          sortBy,
          sortOrder,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          frequencyCategories: filters.frequencyCategories || undefined,
        });
        
        setSongs(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore((currentPage * pageSize) < searchResult.totalCount);
        
      } catch (err) {
        setError('コンサート楽曲の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchConcertSongs();
  }, [currentPage, pageSize, searchQuery, sortBy, sortOrder, filters]);

  return {
    songs,
    loading,
    error,
    totalCount,
    hasMore,
  };
};