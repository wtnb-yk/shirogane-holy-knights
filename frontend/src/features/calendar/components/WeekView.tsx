'use client';

import React from 'react';
import { Event } from '../types';
import { calculateWeekEventLayout } from '../utils/weekEventLayout';
import { CalendarEventItem } from './CalendarEventItem';

interface WeekViewProps {
  weekDates: Date[];
  events: Event[];
  currentMonth: number;
  onEventClick: (event: Event) => void;
}

export function WeekView({ weekDates, events, currentMonth, onEventClick }: WeekViewProps) {
  const weekStartDate = weekDates[0];
  const weekEndDate = weekDates[6];

  const layout = calculateWeekEventLayout(weekStartDate, weekEndDate, events);

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
  const bandSpacing = 2;
  const totalBandHeight = layout.maxLanes > 0 ? (bandHeight + bandSpacing) * layout.maxLanes : 0;

  return (
    <div className="week-container relative">
      {/* 固定幅7列の日付セルグリッド */}
      <div
        className="grid grid-cols-7"
        style={{
          paddingTop: `${totalBandHeight}px`
        }}
      >
        {weekDates.map((date, dayIndex) => {
          const dayEvents = layout.singleDayEvents[dayIndex] || [];
          const eventsToShow = dayEvents.slice(0, 3);
          const remainingCount = dayEvents.length - 3;
          const isSunday = dayIndex === 0;
          const isSaturday = dayIndex === 6;

          return (
            <div
              key={dayIndex}
              className={`
                min-h-[120px] p-2 border-r border-b border-surface-border/30 last:border-r-0
                ${!isCurrentMonth(date) ? 'bg-bg-accent/10' : 'bg-bg-primary'}
                ${isToday(date) ? 'bg-accent-gold-light' : ''}
                hover:bg-bg-accent/10 transition-colors duration-200 relative
              `}
            >
              <div className={`text-sm font-medium mb-2 ${
                !isCurrentMonth(date)
                  ? 'text-text-muted' :
                isToday(date)
                  ? 'text-text-inverse font-bold bg-accent-gold w-8 h-8 rounded-full flex items-center justify-center' :
                isSunday
                  ? 'text-red-500' :
                isSaturday
                  ? 'text-accent-blue'
                  : 'text-text-primary'
              }`}>
                {date.getDate()}
              </div>

              <div className="space-y-1">
                {eventsToShow.map((event) => (
                  <CalendarEventItem
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                  />
                ))}
                {remainingCount > 0 && (
                  <div className="text-xs text-text-secondary font-medium px-2 py-1">
                    +{remainingCount}件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 複数日イベントの帯表示 - セル上部に絶対配置 */}
      <div className="absolute top-0 left-0 right-0" style={{ height: `${totalBandHeight}px` }}>
        {layout.eventBands.map((segment, index) => {
          const leftPercent = (segment.startDayIndex / 7) * 100;
          const widthPercent = ((segment.endDayIndex - segment.startDayIndex + 1) / 7) * 100;
          const topOffset = (bandHeight + bandSpacing) * segment.laneIndex;

          return (
            <button
              key={`${segment.event.id}-${index}`}
              onClick={() => onEventClick(segment.event)}
              className={`
                absolute rounded px-2 py-1 text-xs font-medium border
                transition-colors duration-200 truncate cursor-pointer
                flex items-center
                ${getEventColor(segment.event)}
              `}
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                top: `${topOffset}px`,
                height: `${bandHeight}px`,
                margin: '0 2px'
              }}
              title={`${segment.event.title} (${segment.event.eventDate}${segment.event.endDate ? ` - ${segment.event.endDate}` : ''})`}
            >
              <span className="truncate">{segment.event.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}