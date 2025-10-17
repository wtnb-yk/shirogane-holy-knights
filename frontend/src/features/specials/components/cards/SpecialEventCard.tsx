'use client';

import React from 'react';
import { SpecialEventDto } from '../../types/types';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { SpecialEventCountdown } from './internals/SpecialEventCountdown';
import { SpecialEventCardDescription } from './internals/SpecialEventCardDescription';
import { formatDateSimple } from '@/utils/componentUtils';

interface SpecialEventCardProps {
  event: SpecialEventDto;
  index: number;
  onEventClick: (event: SpecialEventDto) => void;
}

const SpecialEventCardComponent = ({ event, index, onEventClick }: SpecialEventCardProps) => {
  const handleTimerExpired = () => {
    console.log(`Event "${event.title}" has started!`);
  };

  return (
    <StaggeredItem index={index}>
      <InteractiveCard
        onClick={() => onEventClick(event)}
        hoverScale="sm"
        className="border-0 rounded-lg bg-bg-primary p-6 cursor-pointer"
      >
        <div className="space-y-4">
          <SpecialEventCardDescription
            title={event.title}
            description={event.description}
          />

          {/* カウントダウンタイマー */}
          <SpecialEventCountdown
            event={event}
            variant="card"
            onEventStarted={handleTimerExpired}
          />

          <div className="flex justify-between items-center text-sm text-text-tertiary">
            <span>{formatDateSimple(event.startDate)}</span>
        </div>
        </div>
      </InteractiveCard>
    </StaggeredItem>
  );
};

SpecialEventCardComponent.displayName = 'SpecialEventCard';

export const SpecialEventCard = React.memo(SpecialEventCardComponent);
