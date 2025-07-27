'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, hasMore, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

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
        <motion.button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            i === currentPage
              ? "bg-sage-300 text-white shadow-lg shadow-sage-300/30"
              : "bg-white border border-sage-200 hover:bg-sage-100 text-sage-300"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </motion.button>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center mt-12 gap-2"
    >
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          currentPage === 1
            ? "bg-sage-200 text-sage-100 cursor-not-allowed opacity-50"
            : "bg-white border border-sage-200 hover:bg-sage-100 hover:shadow-md text-sage-300"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          !hasMore
            ? "bg-sage-200 text-sage-100 cursor-not-allowed opacity-50"
            : "bg-white border border-sage-200 hover:bg-sage-100 hover:shadow-md text-sage-300"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
};