'use client';

import { useState, useEffect, useMemo } from 'react';
import { LambdaClient } from '@/api/lambdaClient';
import { ArchiveDto } from '@/api/types';

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

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined
        });
        
        setArchives(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        console.error('Error fetching archives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [currentPage, pageSize, searchQuery]);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 検索時は1ページ目に戻る
  };

  const clearSearch = () => {
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
  }), [archives, loading, error, currentPage, totalCount, hasMore, totalPages, setCurrentPage, searchQuery]);
};