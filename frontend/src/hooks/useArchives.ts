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
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // すべてのフィルター条件をバックエンドに送信してフィルタリング済みデータを取得
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined,
          tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        });
        
        setArchives(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        
        // 利用可能なタグを収集（元のデータから）
        const allTags = new Set<string>();
        (searchResult.items || []).forEach(item => {
          item.tags?.forEach(tag => allTags.add(tag));
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