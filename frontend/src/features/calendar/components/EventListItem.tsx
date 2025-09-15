'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Event } from '../types';

interface EventListItemProps {
  event: Event;
  onClick: (event: Event) => void;
}

export function EventListItem({ event, onClick }: EventListItemProps) {
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  const getEventTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-badge-blue/10 text-badge-blue border-badge-blue/20';
      case 'goods':
        return 'bg-badge-orange/10 text-badge-orange border-badge-orange/20';
      case 'campaign':
        return 'bg-badge-green/10 text-badge-green border-badge-green/20';
      default:
        return 'bg-badge-gray/10 text-badge-gray border-badge-gray/20';
    }
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
    <div
      className="group p-4 bg-bg-primary hover:bg-bg-accent/10 border border-surface-border rounded-lg cursor-pointer transition-all duration-200"
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
                <span
                  key={type.id}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getEventTypeBadgeStyle(type.type)}`}
                >
                  {getEventTypeLabel(type.type)}
                </span>
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