'use client';

import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationResult {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  setCurrentPage: (page: number) => void;
  resetToFirstPage: () => void;
}

/**
 * ページネーション機能を管理するhook
 * @param options ページサイズと初期ページ
 * @param totalCount 総アイテム数（外部から注入）
 */
export const usePagination = (
  options: UsePaginationOptions = {},
  totalCount: number = 0
): UsePaginationResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => 
    Math.ceil(totalCount / pageSize), 
    [totalCount, pageSize]
  );

  const hasMore = useMemo(() => 
    currentPage < totalPages, 
    [currentPage, totalPages]
  );

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    hasMore,
    setCurrentPage,
    resetToFirstPage,
  };
};