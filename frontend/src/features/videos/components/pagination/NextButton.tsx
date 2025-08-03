'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NextButtonProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export const NextButton = ({ currentPage, hasMore, onPageChange }: NextButtonProps) => {
  return (
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
  );
};