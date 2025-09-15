'use client';

import React from 'react';
import { Event } from '../types';
import { calculateWeekEventLayout } from '../utils/weekEventLayout';
import { CalendarDateCell } from './CalendarDateCell';

interface WeekViewProps {
  weekDates: Date[];
  events: Event[];
  currentMonth: number;
  onEventClick: (event: Event) => void;
}

export function WeekView({ weekDates, events, currentMonth, onEventClick }: WeekViewProps) {
  const weekStartDate = weekDates[0];
  const weekEndDate = weekDates[6];

  // 週の終了日を土曜日の23:59:59に設定
  const actualWeekEndDate = new Date(weekEndDate);
  actualWeekEndDate.setHours(23, 59, 59, 999);

  const layout = calculateWeekEventLayout(weekStartDate, actualWeekEndDate, events);

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth;
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventColor = (event: Event) => {
    const primaryType = event.eventTypes[0];
    if (!primaryType) return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';

    switch (primaryType.type) {
      case 'event':
        return 'bg-badge-blue/20 text-badge-blue border-badge-blue/30 hover:bg-badge-blue/30';
      case 'goods':
        return 'bg-badge-orange/20 text-badge-orange border-badge-orange/30 hover:bg-badge-orange/30';
      case 'campaign':
        return 'bg-badge-green/20 text-badge-green border-badge-green/30 hover:bg-badge-green/30';
      default:
        return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';
    }
  };

  const bandHeight = 24;
  const totalBandHeight = layout.maxLanes * (bandHeight + 4);

  return (
    <div className="relative grid grid-cols-7">
      {/* 日付セル */}
      {weekDates.map((date, dayIndex) => {
        const dayEvents = layout.singleDayEvents[dayIndex] || [];

        return (
          <CalendarDateCell
            key={dayIndex}
            date={date}
            events={dayEvents}
            bandReservedHeight={totalBandHeight}
            isCurrentMonth={isCurrentMonth(date)}
            isToday={isToday(date)}
            isSunday={dayIndex === 0}
            isSaturday={dayIndex === 6}
            onEventClick={onEventClick}
          />
        );
      })}

      {/* セル境界を跨ぐ連続帯要素 - セル内コンテンツ領域に配置 */}
      {layout.eventBands.map((segment, index) => {
        const leftPercent = (segment.startDayIndex / 7) * 100;
        const widthPercent = ((segment.endDayIndex - segment.startDayIndex + 1) / 7) * 100;
        const topOffset = 40 + segment.laneIndex * (bandHeight + 4); // セル内の日付表示の下

        // マージンと幅を適切に設定
        const isStart = segment.startDayIndex > 0; // 週の開始ではない
        const isEnd = segment.endDayIndex < 6; // 週の終了ではない
        const marginLeft = isStart ? '8px' : '0px';

        // 終了日の場合は幅を8px縮める
        const adjustedWidthPercent = isEnd ? `calc(${widthPercent}% - 8px)` : `${widthPercent}%`;

        return (
          <button
            key={`${segment.event.id}-${index}`}
            onClick={() => onEventClick(segment.event)}
            className={`
              absolute rounded px-2 py-1 text-xs font-medium border
              transition-colors duration-200 truncate cursor-pointer z-10
              flex items-center
              ${getEventColor(segment.event)}
            `}
            style={{
              left: `${leftPercent}%`,
              width: adjustedWidthPercent,
              top: `${topOffset}px`,
              height: `${bandHeight}px`,
              marginLeft
            }}
            title={`${segment.event.title} (${segment.event.eventDate}${segment.event.endDate ? ` - ${segment.event.endDate}` : ''})`}
          >
            <span className="truncate">{segment.event.title}</span>
          </button>
        );
      })}
    </div>
  );
}