'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize
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
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    archives,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
  };
};