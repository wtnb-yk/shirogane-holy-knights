'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DateRangeInputProps } from '@/types/common';
import { DateInput } from '@/components/ui/DateInput';

/**
 * 日付範囲入力コンポーネント
 * DateInputを組み合わせた日付範囲選択に特化
 */
export const DateRangeInput = ({
  startDate,
  endDate,
  onDateChange,
  startLabel = "開始日",
  endLabel = "終了日",
  disabled = false,
  className,
  variant = 'sidebar',
  size = 'md',
  ...props
}: DateRangeInputProps) => {
  const handleStartDateChange = (value: string) => {
    onDateChange('startDate', value);
  };

  const handleEndDateChange = (value: string) => {
    onDateChange('endDate', value);
  };


  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <DateInput
            value={startDate}
            onChange={handleStartDateChange}
            label={startLabel}
            disabled={disabled}
            variant={variant}
            size={size}
            aria-label={startLabel}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-medium mb-1">&nbsp;</div>
          <div className="flex items-center h-10">
            <div className="w-3 h-px bg-text-tertiary"></div>
          </div>
        </div>

        <div className="flex-1">
          <DateInput
            value={endDate}
            onChange={handleEndDateChange}
            label={endLabel}
            disabled={disabled}
            variant={variant}
            size={size}
            aria-label={endLabel}
          />
        </div>
      </div>
    </div>
  );
};
