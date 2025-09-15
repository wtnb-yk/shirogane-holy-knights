'use client';

import React from 'react';
import { Event } from '../types';
import { MobileDateSection } from './MobileDateSection';
import { getCalendarWeeks } from '../utils/dateUtils';

interface MobileMonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick?: (date: Date, events: Event[]) => void;
}

export function MobileMonthView({ currentDate, events, onEventClick, onDateClick }: MobileMonthViewProps) {
  const currentMonth = currentDate.getMonth();
  const weeks = getCalendarWeeks(currentDate);

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return events.filter(event => {
      const eventStart = event.eventDate;
      const eventEnd = event.endDate || event.eventDate;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth;
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const allDates = weeks.flat();
  const datesToShow = allDates.filter(date => {
    const monthDiff = Math.abs(date.getMonth() - currentMonth);
    return monthDiff <= 1 || monthDiff >= 11;
  });

  return (
    <div className="bg-bg-primary rounded-lg border border-surface-border shadow-sm">
      {datesToShow.map((date) => {
        const dateEvents = getEventsForDate(date);

        if (!isCurrentMonth(date) && dateEvents.length === 0) {
          return null;
        }

        return (
          <MobileDateSection
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
            date={date}
            events={dateEvents}
            isCurrentMonth={isCurrentMonth(date)}
            isToday={isToday(date)}
            onEventClick={onEventClick}
            onShowMoreEvents={onDateClick}
          />
        );
      })}
    </div>
  );
}