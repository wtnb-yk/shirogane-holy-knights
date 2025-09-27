import React from 'react';
import { Event } from '../../../types';

interface EventDescriptionProps {
  event: Event;
}

export function EventDescription({ event }: EventDescriptionProps) {
  if (!event.description) {
    return null;
  }

  return (
    <div>
      <p className="text-secondary whitespace-pre-line leading-relaxed">
        {event.description}
      </p>
    </div>
  );
}