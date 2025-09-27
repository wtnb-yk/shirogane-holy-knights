import React from 'react';
import { Event } from '../../../types';
import { Badge } from '@/components/ui/badge';
import { getEventTypeBadgeStyle } from '../../../utils/eventBadgeStyles';
import { getEventTypeLabel } from '../../../utils/eventTypeUtils';
import { EventExternalLinkButton } from './EventExternalLinkButton';

interface EventTitleProps {
  event: Event;
}

export function EventTitle({ event }: EventTitleProps) {
  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-bold text-primary leading-tight flex-1">
          {event.title}
        </h3>
        {event.url && <EventExternalLinkButton url={event.url} />}
      </div>

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
