'use client';

import React from 'react';
import { Event } from '../types';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { WeekView } from './WeekView';
import { MobileMonthView } from './MobileMonthView';
import { getCalendarWeeks } from '../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date, events: Event[]) => void;
  onMobileDateClick?: (date: Date, events: Event[]) => void;
}

export function MonthView({ currentDate, events, onEventClick, onDateClick, onMobileDateClick }: MonthViewProps) {
  const currentMonth = currentDate.getMonth();
  const weeks = getCalendarWeeks(currentDate);

  const getEventsForWeek = (weekDates: Date[]) => {
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];

    return events.filter(event => {
      const eventStart = new Date(event.eventDate + 'T00:00:00');
      const eventEnd = new Date((event.endDate || event.eventDate) + 'T23:59:59');
      return weekEnd && weekStart && eventStart <= weekEnd && eventEnd >= weekStart;
    });
  };

  return (
    <StaggeredItem index={0} className="opacity-0 animate-stagger-fade">
      {/* デスクトップ・タブレット表示 */}
      <div className="hidden md:block bg-bg-primary border border-surface-border rounded-lg overflow-hidden shadow-sm">
        <CalendarWeekHeader />

        <div className="space-y-0">
          {weeks.map((weekDates, weekIndex) => (
            <div key={weekIndex} className="border-b border-surface-border/30 last:border-b-0">
              <WeekView
                weekDates={weekDates}
                events={getEventsForWeek(weekDates)}
                currentMonth={currentMonth}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* スマホ表示 */}
      <div className="block md:hidden">
        <MobileMonthView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateClick={onMobileDateClick}
        />
      </div>
    </StaggeredItem>
  );
}
