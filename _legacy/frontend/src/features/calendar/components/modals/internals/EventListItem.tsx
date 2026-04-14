'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Event } from '../../../types';
import { Badge } from '@/components/Badge/badge';
import { getEventTypeBadgeStyle } from '../../../utils/eventBadgeStyles';
import { formatTime } from '../../../utils/formatters';
import { getEventTypeLabel } from '../../../utils/eventTypeUtils';

interface EventListItemProps {
  event: Event;
  onClick: (event: Event) => void;
}

export function EventListItem({ event, onClick }: EventListItemProps) {

  return (
    <div
      className="group p-4 bg-bg-primary hover:bg-bg-hover border border-surface-border rounded-lg cursor-pointer transition-all duration-200"
      onClick={() => onClick(event)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {event.eventTime && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(event.eventTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}
            <div className="flex gap-1">
              {event.eventTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant="outline"
                  className={`cursor-default text-xs px-2 py-0.5 ${getEventTypeBadgeStyle(type.type, 'light')}`}
                >
                  {getEventTypeLabel(type.type)}
                </Badge>
              ))}
            </div>
          </div>

          <h3 className="text-base font-medium text-text-primary group-hover:text-accent-gold transition-colors">
            {event.title}
          </h3>

          {event.description && (
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent-gold transition-colors ml-3 flex-shrink-0" />
      </div>
    </div>
  );
}