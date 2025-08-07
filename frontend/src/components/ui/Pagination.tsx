'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
  animationDelay?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  loading = false,
  animationDelay,
  size = 'md',
  className
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  const buttonSizeClasses = {
    sm: 'px-4 py-2',
    md: 'w-10 h-10'
  };

  const prevNextSizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-3 py-2'
  };

  const baseButtonClasses = "text-sm font-medium rounded-lg transition-all duration-ui disabled:opacity-50 disabled:cursor-not-allowed";
  const pageButtonClasses = cn(
    baseButtonClasses,
    buttonSizeClasses[size]
  );
  const prevNextButtonClasses = cn(
    baseButtonClasses,
    prevNextSizeClasses[size],
    "flex items-center gap-2"
  );

  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-2 mt-8 opacity-0 animate-slide-up",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* 前のページボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className={cn(
          prevNextButtonClasses,
          "text-text-secondary bg-bg-primary border border-surface-border hover:bg-bg-accent hover:text-text-primary",
          "disabled:hover:bg-bg-primary disabled:hover:text-text-secondary"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        前
      </button>

      {/* ページ番号 */}
      <div className="flex items-center gap-1">
        {/* 最初のページ */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className={cn(
                pageButtonClasses,
                "text-text-secondary bg-bg-primary border border-surface-border hover:bg-bg-accent hover:text-text-primary",
                size === 'sm' && "hover:scale-110 hover:-translate-y-0.5"
              )}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-text-secondary">...</span>
            )}
          </>
        )}

        {/* 表示範囲のページ */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={cn(
              pageButtonClasses,
              page === currentPage
                ? "bg-text-secondary text-white shadow-lg shadow-text-secondary/30"
                : cn(
                    "text-text-secondary bg-bg-primary border border-surface-border hover:bg-bg-accent hover:text-text-primary",
                    size === 'sm' && "hover:scale-110 hover:-translate-y-0.5"
                  )
            )}
          >
            {page}
          </button>
        ))}

        {/* 最後のページ */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-text-secondary">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className={cn(
                pageButtonClasses,
                "text-text-secondary bg-bg-primary border border-surface-border hover:bg-bg-accent hover:text-text-primary",
                size === 'sm' && "hover:scale-110 hover:-translate-y-0.5"
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* 次のページボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || !hasMore || loading}
        className={cn(
          prevNextButtonClasses,
          "text-text-secondary bg-bg-primary border border-surface-border hover:bg-bg-accent hover:text-text-primary",
          "disabled:hover:bg-bg-primary disabled:hover:text-text-secondary"
        )}
      >
        次
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};