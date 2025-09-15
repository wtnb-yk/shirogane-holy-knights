'use client';

import React from 'react';
import { Event } from '../types';
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

  // カレンダーの日付配列を生成（週ごとに分割）
  const weeks = [];
  const currentCalendarDate = new Date(startDate);

  while (currentCalendarDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentCalendarDate));
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }
    weeks.push(week);
  }

  // 日付が現在の月に属するかチェック
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  // 今日の日付かチェック
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 日付が範囲内にあるかチェック
  const isDateInRange = (date: Date, startDateStr: string, endDateStr?: string) => {
    const targetDate = new Date(date.toISOString().split('T')[0] + 'T00:00:00');
    const start = new Date(startDateStr + 'T00:00:00');
    const end = endDateStr ? new Date(endDateStr + 'T00:00:00') : start;

    return targetDate >= start && targetDate <= end;
  };


  // イベントタイプから色を取得
  const getEventColor = (event: Event) => {
    const primaryType = event.eventTypes[0];
    if (!primaryType) return 'bg-gray-200 text-gray-700';

    switch (primaryType.type) {
      case 'event':
        return 'bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30';
      case 'goods':
        return 'bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30';
      case 'campaign':
        return 'bg-text-secondary/20 text-text-secondary hover:bg-text-secondary/30';
      default:
        return 'bg-gray-200 text-gray-700';
    }
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

        {/* カレンダー本体 */}
        <div className="grid grid-cols-7">
          {weeks.flat().map((date, dateIndex) => {
            const isCurrentMonthDate = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const dayIndex = dateIndex % 7;

            // 日付文字列を統一形式で作成（タイムゾーン問題回避）
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


            // この日のイベントを取得
            const eventsToShow = [];

            return (
              <div
                key={dateIndex}
                className={`
                  min-h-[120px] p-2 border-r border-b border-surface-border/30 last:border-r-0
                  ${!isCurrentMonthDate ? 'bg-bg-accent/10' : 'bg-bg-primary'}
                  ${isTodayDate ? 'bg-accent-blue/5 border-accent-blue/20' : ''}
                  hover:bg-bg-accent/10 transition-colors duration-200 relative
                `}
              >
                {/* 日付 */}
                <div className={`text-sm font-medium mb-2 ${
                  !isCurrentMonthDate
                    ? 'text-text-muted' :
                  isTodayDate
                    ? 'text-accent-blue font-semibold' :
                  dayIndex === 0
                    ? 'text-red-500' :
                  dayIndex === 6
                    ? 'text-accent-blue'
                    : 'text-text-primary'
                }`}>
                  {date.getDate()}
                </div>

                {/* イベント表示 */}
                <div className="mt-1">
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StaggeredItem>
  );
}