import React from 'react';
import { Event } from '../../../types';
import { Badge } from '@/components/ui/badge';
import { getEventTypeBadgeStyle } from '../../../utils/eventBadgeStyles';
import { getEventTypeLabel } from '../../../utils/eventTypeUtils';

interface EventTitleProps {
  event: Event;
}

export function EventTitle({ event }: EventTitleProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
        {event.title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {event.eventTypes.map((type) => (
          <Badge
            key={type.id}
            variant="outline"
            className={`cursor-default text-sm px-3 py-1.5 ${getEventTypeBadgeStyle(type.type, 'modal')}`}
          >
            {getEventTypeLabel(type.type)}
          </Badge>
        ))}
      </div>
    </div>
  );
}