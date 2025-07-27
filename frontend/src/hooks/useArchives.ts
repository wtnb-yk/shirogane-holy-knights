'use client';

import { useState, useEffect, useMemo } from 'react';
import { LambdaClient } from '@/api/lambdaClient';
import { ArchiveDto } from '@/api/types';
import { FilterOptions } from '@/components/archives/FilterBar';

interface UseArchivesResult {
  archives: ArchiveDto[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags: string[];
  clearAllFilters: () => void;
}

interface UseArchivesOptions {
  pageSize?: number;
  initialPage?: number;
}

export const useArchives = (options: UseArchivesOptions = {}): UseArchivesResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  const [archives, setArchives] = useState<ArchiveDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    selectedTags: [],
    startDate: undefined,
    endDate: undefined,
    duration: undefined,
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // バックエンドAPIは現在 query, page, pageSize のみ対応
        // フィルター機能はフロントエンド側で実装
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined,
        });
        
        let filteredItems = searchResult.items || [];
        
        // フロントエンド側でのフィルタリング
        
        // タグフィルタリング
        if (filters.selectedTags.length > 0) {
          filteredItems = filteredItems.filter(item =>
            filters.selectedTags.some(tag => item.tags.includes(tag))
          );
        }
        
        // 日付範囲フィルタリング
        if (filters.startDate || filters.endDate) {
          filteredItems = filteredItems.filter(item => {
            const itemDate = new Date(item.publishedAt);
            if (filters.startDate && itemDate < new Date(filters.startDate)) {
              return false;
            }
            if (filters.endDate && itemDate > new Date(filters.endDate)) {
              return false;
            }
            return true;
          });
        }
        
        // 再生時間でのフィルタリング
        if (filters.duration) {
          filteredItems = filteredItems.filter(item => {
            if (!item.duration) return false;
            const duration = parseDuration(item.duration);
            switch (filters.duration) {
              case 'short': return duration <= 30;
              case 'medium': return duration > 30 && duration <= 120;
              case 'long': return duration > 120;
              default: return true;
            }
          });
        }
        
        setArchives(filteredItems);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        
        // 利用可能なタグを収集（元のデータから）
        const allTags = new Set<string>();
        (searchResult.items || []).forEach(item => {
          item.tags.forEach(tag => allTags.add(tag));
        });
        setAvailableTags(Array.from(allTags).sort());
        
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        console.error('Error fetching archives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [currentPage, pageSize, searchQuery, filters]);

  // 再生時間をパースする関数（例: "1:30:45" -> 90.75分）
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    } else if (parts.length === 2) {
      return parts[0] + parts[1] / 60;
    }
    return 0;
  };

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      selectedTags: [],
      startDate: undefined,
      endDate: undefined,
      duration: undefined,
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return useMemo(() => ({
    archives,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    handleSearch,
    clearSearch,
    filters,
    setFilters: handleFiltersChange,
    availableTags,
    clearAllFilters,
  }), [archives, loading, error, currentPage, totalCount, hasMore, totalPages, setCurrentPage, searchQuery, filters, availableTags]);
};