'use client';

import React from 'react';
import { CountdownTimer } from '@/components/Timer';
import { SpecialEventDto } from '../types';
import { cn } from '@/lib/utils';

export interface SpecialEventCountdownProps {
  event: SpecialEventDto;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
  onEventStarted?: (event: SpecialEventDto) => void;
}

/**
 * スペシャルイベント用のカウントダウンタイマーコンポーネント
 * SpecialEventDto と CountdownTimer を統合
 */
export function SpecialEventCountdown({
  event,
  className,
  variant = 'default',
  onEventStarted
}: SpecialEventCountdownProps) {
  const handleExpired = () => {
    if (onEventStarted) {
      onEventStarted(event);
    }
  };

  // イベントが既に開始済みまたは終了済みの場合はステータス表示
  if (event.status !== 'upcoming') {
    const statusConfig = {
      active: {
        label: '開催中',
        bgColor: 'bg-accent-green/10',
        textColor: 'text-accent-green',
        borderColor: 'border-accent-green/20',
        dotColor: 'bg-accent-green'
      },
      ended: {
        label: '終了',
        bgColor: 'bg-text-muted/10',
        textColor: 'text-text-muted',
        borderColor: 'border-text-muted/20',
        dotColor: 'bg-text-muted'
      }
    };

    const config = statusConfig[event.status];

    return (
      <div className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}>
        <div className={cn('w-2 h-2 rounded-full mr-2', config.dotColor, {
          'animate-pulse': event.status === 'active'
        })} />
        {config.label}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {variant === 'card' && (
        <div className="text-sm text-text-muted font-medium">
          開始まで
        </div>
      )}
      <CountdownTimer
        targetDate={event.startDate}
        variant={variant}
        onExpired={handleExpired}
      />
    </div>
  );
}

export default SpecialEventCountdown;