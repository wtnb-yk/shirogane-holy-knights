'use client';

import React from 'react';
import { Event } from '../../../types';
import { EventSegment } from '../../../utils/weekEventLayout';
import { getEventColor } from '../../../utils/eventUtils';

interface EventBandProps {
  segment: EventSegment;
  bandHeight: number;
  onEventClick: (event: Event) => void;
}

export function EventBand({ segment, bandHeight, onEventClick }: EventBandProps) {
  const leftPercent = (segment.startDayIndex / 7) * 100;
  const widthPercent = ((segment.endDayIndex - segment.startDayIndex + 1) / 7) * 100;
  const topOffset = 40 + segment.laneIndex * (bandHeight + 4);

  const isStart = segment.startDayIndex > 0;
  const isEnd = segment.endDayIndex < 6;
  const marginLeft = isStart ? '8px' : '0px';
  const adjustedWidthPercent = isEnd ? `calc(${widthPercent}% - 8px)` : `${widthPercent}%`;

  return (
    <button
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
}