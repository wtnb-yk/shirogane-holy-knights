'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrevButtonProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PrevButton = ({ currentPage, onPageChange }: PrevButtonProps) => {
  return (
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
  );
};