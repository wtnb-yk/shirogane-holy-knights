'use client';

import { useState, useMemo, useCallback } from 'react';

interface UseDiscographyPaginationOptions {
  pageSize: number;
  initialPage: number;
}

interface UseDiscographyPaginationResult {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  resetToFirstPage: () => void;
}

/**
 * アルバムページネーション機能のフック
 * useNewsPaginationパターンに完全準拠
 */
export const useDiscographyPagination = (
  options: UseDiscographyPaginationOptions,
  totalCount: number
): UseDiscographyPaginationResult => {
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