'use client';

import React from 'react';
import { PageNumbers } from './pagination/PageNumbers';
import { PrevButton } from './pagination/PrevButton';
import { NextButton } from './pagination/NextButton';

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

  return (
    <div className="flex items-center justify-center mt-12 gap-2">
      <PrevButton
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      <PageNumbers
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <NextButton
        currentPage={currentPage}
        hasMore={hasMore}
        onPageChange={onPageChange}
      />
    </div>
  );
};