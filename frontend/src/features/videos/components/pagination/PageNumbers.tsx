'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageNumbers = ({ currentPage, totalPages, onPageChange }: PageNumbersProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            i === currentPage
              ? "bg-sage-300 text-white shadow-lg shadow-sage-300/30"
              : "bg-white border border-sage-200 hover:bg-sage-100 text-sage-300 hover:scale-110 hover:-translate-y-0.5"
          )}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="px-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex gap-1">
      {renderPageNumbers()}
    </div>
  );
};