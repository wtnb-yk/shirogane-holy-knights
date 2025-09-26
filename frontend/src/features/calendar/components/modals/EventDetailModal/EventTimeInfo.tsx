import React from 'react';
import { Clock } from 'lucide-react';
import { Event } from '../../../types';
import { formatTime } from '../../../utils/formatters';

interface EventTimeInfoProps {
  event: Event;
}

export function EventTimeInfo({ event }: EventTimeInfoProps) {
  if (!event.eventTime) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-3 text-primary">
        <Clock className="w-5 h-5 text-secondary" />
        <span className="text-lg font-semibold">
          {formatTime(event.eventTime)}
          {event.endTime && ` - ${formatTime(event.endTime)}`}
        </span>
      </div>
    </div>
  );
}