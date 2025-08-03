'use client';

import { useState, useMemo, useCallback } from 'react';

interface UseNewsPaginationOptions {
  pageSize: number;
  initialPage: number;
}

interface UseNewsPaginationResult {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  resetToFirstPage: () => void;
}

/**
 * ニュースページネーション機能のフック
 */
export const useNewsPagination = (
  options: UseNewsPaginationOptions,
  totalCount: number
): UseNewsPaginationResult => {
  const { pageSize, initialPage } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 総ページ数を計算
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    resetToFirstPage,
  };
};