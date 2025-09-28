'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatsSummary } from '@/components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
  animationDelay?: string;
  className?: string;
  totalCount?: number;
  pageSize?: number;
}

// スタイル定数
const STYLES = {
  base: "text-sm font-medium rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
  page: "px-4 py-2 min-w-[36px] h-[36px] flex items-center justify-center",
  navigation: "px-3 py-2 flex items-center gap-1",
  default: "text-gray-600 bg-white border border-gray-300 hover:border-amber-200 hover:text-amber-700 hover:scale-110 hover:-translate-y-0.5",
  active: "bg-amber-200 text-amber-900 border-amber-200 font-bold",
  disabled: "disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-200"
} as const;

// 子コンポーネント
interface PaginationButtonProps {
  page: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const PaginationButton = ({ page, currentPage, loading, onPageChange }: PaginationButtonProps) => (
  <button
    onClick={() => onPageChange(page)}
    disabled={loading}
    className={cn(
      STYLES.base,
      STYLES.page,
      page === currentPage ? STYLES.active : STYLES.default
    )}
  >
    {page}
  </button>
);

interface NavigationButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  loading: boolean;
  onPageChange: () => void;
}

const NavigationButton = ({ direction, disabled, loading, onPageChange }: NavigationButtonProps) => {
  const isPrev = direction === 'prev';
  return (
    <button
      onClick={onPageChange}
      disabled={disabled || loading}
      className={cn(STYLES.base, STYLES.navigation, STYLES.default, STYLES.disabled)}
    >
      {isPrev && <ChevronLeft className="w-4 h-4" />}
      {isPrev ? '前' : '次'}
      {!isPrev && <ChevronRight className="w-4 h-4" />}
    </button>
  );
};

// ページ範囲計算のヘルパー関数
const getVisiblePages = (currentPage: number, totalPages: number, delta = 2): number[] => {
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination = ({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  loading = false,
  animationDelay,
  className,
  totalCount,
  pageSize
}: PaginationProps) => {
  // ページ数が1以下の場合は統計のみ表示
  if (totalPages <= 1) {
    return totalCount && pageSize ? (
      <StatsSummary
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        loading={loading}
      />
    ) : null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const showFirstPage = visiblePages[0]! > 1;
  const showLastPage = visiblePages[visiblePages.length - 1]! < totalPages;
  const showFirstEllipsis = visiblePages[0]! > 2;
  const showLastEllipsis = visiblePages[visiblePages.length - 1]! < totalPages - 1;

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-center gap-2 mb-4 opacity-0 animate-slide-up",
          className
        )}
        style={animationDelay ? { animationDelay } : undefined}
      >
        <NavigationButton
          direction="prev"
          disabled={currentPage <= 1}
          loading={loading}
          onPageChange={() => onPageChange(currentPage - 1)}
        />

        <div className="flex items-center gap-1">
          {showFirstPage && (
            <>
              <PaginationButton
                page={1}
                currentPage={currentPage}
                loading={loading}
                onPageChange={onPageChange}
              />
              {showFirstEllipsis && <span className="px-2 text-gray-400">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationButton
              key={page}
              page={page}
              currentPage={currentPage}
              loading={loading}
              onPageChange={onPageChange}
            />
          ))}

          {showLastPage && (
            <>
              {showLastEllipsis && <span className="px-2 text-gray-400">...</span>}
              <PaginationButton
                page={totalPages}
                currentPage={currentPage}
                loading={loading}
                onPageChange={onPageChange}
              />
            </>
          )}
        </div>

        <NavigationButton
          direction="next"
          disabled={currentPage >= totalPages || !hasMore}
          loading={loading}
          onPageChange={() => onPageChange(currentPage + 1)}
        />
      </div>

      {totalCount && pageSize && (
        <StatsSummary
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          loading={loading}
        />
      )}
    </>
  );
};
