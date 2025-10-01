'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/Button/IconButton';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarHeader({
  currentDate,
  onDateChange
}: CalendarHeaderProps) {
  const formatDisplayDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="mb-4 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-text-primary">
          {formatDisplayDate(currentDate)}
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={<ChevronLeft className="w-5 h-5" />}
            onClick={() => navigateDate('prev')}
            aria-label="前月"
            variant="secondary-blue"
          />

          <IconButton
            icon={<ChevronRight className="w-5 h-5" />}
            onClick={() => navigateDate('next')}
            aria-label="次月"
            variant="secondary-blue"
          />

          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
          >
            今日
          </Button>
        </div>
      </div>
    </div>
  );
}
