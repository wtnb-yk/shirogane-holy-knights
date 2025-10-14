'use client';

import React from 'react';
import { Event } from '../../../types';
import { calculateWeekEventLayout } from '../../../utils/weekEventLayout';
import { CalendarDateCell } from './CalendarDateCell';
import { EventBand } from './EventBand';
import { isCurrentMonth, isToday } from '../../../utils/eventUtils';
import { EVENT_HEIGHT, EVENT_MARGIN } from '../../../constants';

interface WeekViewProps {
  weekDates: Date[];
  events: Event[];
  currentMonth: number;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date, events: Event[]) => void;
}

export function WeekView({ weekDates, events, currentMonth, onEventClick, onDateClick }: WeekViewProps) {
  const weekStartDate = weekDates[0];
  const lastDate = weekDates[6];
  if (!weekStartDate || !lastDate) return null;

  const weekEndDate = new Date(lastDate);
  weekEndDate.setHours(23, 59, 59, 999);

  const layout = calculateWeekEventLayout(weekStartDate, weekEndDate, events);

  // 各日付について、その日に存在する複数日イベントの最大レーン数を計算
  const getBandReservedHeight = (dayIndex: number) => {
    const segmentsOnThisDay = layout.eventBands.filter(
      segment => dayIndex >= segment.startDayIndex && dayIndex <= segment.endDayIndex
    );

    if (segmentsOnThisDay.length === 0) return 0;

    const maxLaneOnThisDay = Math.max(...segmentsOnThisDay.map(s => s.laneIndex)) + 1;
    return maxLaneOnThisDay * (EVENT_HEIGHT + EVENT_MARGIN);
  };

  const getEventsForDate = (date: Date) => {
    const dayIndex = weekDates.findIndex(d => d.toDateString() === date.toDateString());
    if (dayIndex === -1) return [];

    const singleDayEvents = layout.singleDayEvents[dayIndex] || [];
    const hiddenSingleDayEvents = layout.hiddenEventsByDay[dayIndex] || [];

    // その日に表示される複数日イベントを取得
    const multiDayEvents = layout.eventBands
      .filter(segment => dayIndex >= segment.startDayIndex && dayIndex <= segment.endDayIndex)
      .map(segment => segment.event);

    return [...singleDayEvents, ...hiddenSingleDayEvents, ...multiDayEvents];
  };

  return (
    <div className="relative grid grid-cols-7">
      {weekDates.map((date, dayIndex) => (
        <CalendarDateCell
          key={dayIndex}
          date={date}
          events={layout.singleDayEvents[dayIndex] || []}
          hiddenEvents={layout.hiddenEventsByDay[dayIndex] || []}
          bandReservedHeight={getBandReservedHeight(dayIndex)}
          isCurrentMonth={isCurrentMonth(date, currentMonth)}
          isToday={isToday(date)}
          isSunday={dayIndex === 0}
          isSaturday={dayIndex === 6}
          onEventClick={onEventClick}
          onDateClick={(clickedDate, _) => onDateClick(clickedDate, getEventsForDate(clickedDate))}
        />
      ))}

      {layout.eventBands.map((segment, index) => (
        <EventBand
          key={`${segment.event.id}-${index}`}
          segment={segment}
          bandHeight={EVENT_HEIGHT}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}
