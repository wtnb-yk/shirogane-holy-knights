'use client';

import React from 'react';
import { Event } from '../types';
import { EventCard } from './EventCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateChange: (date: Date) => void;
}

export function MonthView({ currentDate, events, onEventClick, onDateChange }: MonthViewProps) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // カレンダーの開始日（月の最初の週の日曜日）
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // カレンダーの終了日（月の最後の週の土曜日）
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  // カレンダーの日付配列を生成
  const calendarDays = [];
  const currentCalendarDate = new Date(startDate);

  while (currentCalendarDate <= endDate) {
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }

  // 特定の日付のイベントを取得
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.eventDate === dateString);
  };

  // 日付が現在の月に属するかチェック
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  // 今日の日付かチェック
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <StaggeredItem index={0} className="opacity-0 animate-stagger-fade">
      <div className="bg-bg-primary border border-surface-border rounded-lg overflow-hidden shadow-sm">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-bg-accent/20 border-b border-surface-border">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`p-3 text-center text-sm font-semibold ${
                index === 0
                  ? 'text-red-500'
                  : index === 6
                    ? 'text-accent-blue'
                    : 'text-text-primary'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-surface-border/30 last:border-r-0 ${
                  !isCurrentMonthDate
                    ? 'bg-bg-accent/10'
                    : 'bg-bg-primary'
                } ${
                  isTodayDate
                    ? 'bg-accent-blue/5 border-accent-blue/20'
                    : ''
                } hover:bg-bg-accent/10 transition-colors duration-200`}
              >
                {/* 日付 */}
                <div className={`text-sm font-medium mb-1 ${
                  !isCurrentMonthDate
                    ? 'text-text-muted' :
                  isTodayDate
                    ? 'text-accent-blue font-semibold' :
                  index % 7 === 0
                    ? 'text-red-500' :
                  index % 7 === 6
                    ? 'text-accent-blue'
                    : 'text-text-primary'
                }`}>
                  {date.getDate()}
                </div>

                {/* イベント */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-text-muted text-center py-1 hover:text-text-secondary transition-colors">
                      他 {dayEvents.length - 3} 件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StaggeredItem>
  );
}
