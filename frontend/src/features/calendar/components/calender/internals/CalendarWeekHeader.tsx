'use client';

import React from 'react';

const WEEK_DAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function CalendarWeekHeader() {
  return (
    <div className="grid grid-cols-7 bg-bg-accent/20 border-b border-surface-border">
      {WEEK_DAYS.map((day, index) => (
        <div
          key={day}
          className={`p-3 text-center text-sm font-semibold ${
            index === 0
              ? 'text-text-sunday'
              : index === 6
                ? 'text-text-saturday'
                : 'text-text-primary'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
}