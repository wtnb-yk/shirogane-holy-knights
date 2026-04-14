'use client';

import React from 'react';
import { Event } from '../../../types';
import { EventTitle } from './EventTitle';
import { EventImage } from './EventImage';
import { EventTimeInfo } from './EventTimeInfo';
import { EventDescription } from './EventDescription';

export interface EventDetailContentProps {
  event: Event | null;
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  if (!event) return null;

  return (
    <div className="space-y-4">
      <EventTitle event={event} />
      <EventImage event={event} />
      <EventTimeInfo event={event} />
      <EventDescription event={event} />
    </div>
  );
}