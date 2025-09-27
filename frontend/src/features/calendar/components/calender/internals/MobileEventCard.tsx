'use client';

import React from 'react';
import { Event } from '../../../types';

interface MobileEventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

export function MobileEventCard({ event, onClick }: MobileEventCardProps) {
  const getEventColor = () => {
    const primaryType = event.eventTypes[0];
    if (!primaryType) return 'bg-badge-gray/10 text-badge-gray border-badge-gray/20 hover:bg-badge-gray/20';

    switch (primaryType.type) {
      case 'event':
        return 'bg-badge-blue/10 text-badge-blue border-badge-blue/20 hover:bg-badge-blue/20';
      case 'goods':
        return 'bg-badge-orange/10 text-badge-orange border-badge-orange/20 hover:bg-badge-orange/20';
      case 'campaign':
        return 'bg-badge-green/10 text-badge-green border-badge-green/20 hover:bg-badge-green/20';
      default:
        return 'bg-badge-gray/10 text-badge-gray border-badge-gray/20 hover:bg-badge-gray/20';
    }
  };

  return (
    <button
      onClick={() => onClick(event)}
      className={`
        w-full text-left px-2 py-1 rounded text-xs font-medium
        border transition-colors duration-200
        truncate
        ${getEventColor()}
      `}
      title={event.title}
    >
      <span className="truncate">{event.title}</span>
    </button>
  );
}