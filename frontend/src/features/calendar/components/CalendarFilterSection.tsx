'use client';

import React from 'react';
import { EventType, CalendarFilterOptions } from '../types';
import { getEventTypeBadgeStyle } from '../utils/eventBadgeStyles';

interface CalendarFilterSectionProps {
  filters: CalendarFilterOptions;
  onFiltersChange: (filters: CalendarFilterOptions) => void;
  eventTypes: EventType[];
}

export const CalendarFilterSection = ({
  filters,
  onFiltersChange,
  eventTypes,
}: CalendarFilterSectionProps) => {

  const handleEventTypeToggle = (eventTypeId: number) => {
    const currentIds = filters.eventTypeIds || [];
    const newIds = currentIds.includes(eventTypeId)
      ? currentIds.filter(id => id !== eventTypeId)
      : [...currentIds, eventTypeId];

    onFiltersChange({
      ...filters,
      eventTypeIds: newIds,
    });
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'イベント';
      case 'goods':
        return 'グッズ';
      case 'campaign':
        return 'キャンペーン';
      default:
        return type;
    }
  };


  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-text-primary mb-3">
          カテゴリ
        </h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((eventType) => {
            const isSelected = filters.eventTypeIds?.includes(eventType.id) || false;

            return (
              <button
                key={eventType.id}
                onClick={() => handleEventTypeToggle(eventType.id)}
                className={`
                  inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200
                  ${isSelected
                    ? `${getEventTypeBadgeStyle(eventType.type, 'light')} ring-2 ring-accent-gold/20`
                    : `${getEventTypeBadgeStyle(eventType.type, 'outline')}`
                  }
                `}
              >
                {getEventTypeLabel(eventType.type)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};