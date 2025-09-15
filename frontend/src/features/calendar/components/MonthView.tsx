'use client';

import React from 'react';
import { Event } from '../types';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { CalendarDateCell } from './CalendarDateCell';
import { getCalendarWeeks, isCurrentMonth, isToday, isDateInRange } from '../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateChange: (date: Date) => void;
}

export function MonthView({ currentDate, events, onEventClick, onDateChange }: MonthViewProps) {
  const currentMonth = currentDate.getMonth();
  const weeks = getCalendarWeeks(currentDate);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (!event.endDate) {
        return isDateInRange(date, event.eventDate);
      }
      return isDateInRange(date, event.eventDate, event.endDate);
    });
  };

  return (
    <StaggeredItem index={0} className="opacity-0 animate-stagger-fade">
      <div className="bg-bg-primary border border-surface-border rounded-lg overflow-hidden shadow-sm">
        <CalendarWeekHeader />

        <div className="grid grid-cols-7">
          {weeks.flat().map((date, dateIndex) => {
            const dayIndex = dateIndex % 7;
            const dayEvents = getEventsForDate(date);

            return (
              <CalendarDateCell
                key={dateIndex}
                date={date}
                events={dayEvents}
                isCurrentMonth={isCurrentMonth(date, currentMonth)}
                isToday={isToday(date)}
                isSunday={dayIndex === 0}
                isSaturday={dayIndex === 6}
                onEventClick={onEventClick}
              />
            );
          })}
        </div>
      </div>
    </StaggeredItem>
  );
}