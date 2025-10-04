'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
  onExpired?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * カウントダウンタイマーコンポーネント
 * 指定された日時までの残り時間をリアルタイムで表示
 */
export function CountdownTimer({
  targetDate,
  className,
  variant = 'default',
  onExpired
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // タイムゾーンを考慮した時間計算
  const calculateTimeRemaining = useMemo(() => {
    return (targetDateString: string): TimeRemaining => {
      const now = new Date().getTime();
      const target = new Date(targetDateString).getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      };
    };
  }, []);

  // リアルタイム更新
  useEffect(() => {
    const updateTimer = () => {
      const newTimeRemaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(newTimeRemaining);

      // 期限切れ時のコールバック実行
      if (newTimeRemaining.isExpired && onExpired) {
        onExpired();
      }
    };

    // 初回実行
    updateTimer();

    // 1秒ごとに更新
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeRemaining, onExpired]);

  // 期限切れの場合
  if (timeRemaining.isExpired) {
    return (
      <div className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
        'bg-surface-secondary/20 text-text-secondary border border-surface-border',
        className
      )}>
        <div className="w-2 h-2 rounded-full bg-accent-green mr-2 animate-pulse" />
        開始済み
      </div>
    );
  }

  // バリアント別のレンダリング
  if (variant === 'compact') {
    return (
      <div 
        className={cn('inline-flex items-center gap-1 text-sm font-mono', className)}
        role="timer"
        aria-live="polite"
        aria-label={`イベント開始まで ${timeRemaining.days}日 ${timeRemaining.hours}時間 ${timeRemaining.minutes}分 ${timeRemaining.seconds}秒`}
      >
        {timeRemaining.days > 0 && (
          <>
            <span className="font-semibold text-text-primary">{timeRemaining.days}</span>
            <span className="text-text-muted">日</span>
          </>
        )}
        <span className="font-semibold text-text-primary">
          {timeRemaining.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-text-muted">:</span>
        <span className="font-semibold text-text-primary">
          {timeRemaining.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-text-muted">:</span>
        <span className="font-semibold text-text-primary">
          {timeRemaining.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div 
        className={cn(
          'bg-gradient-to-br from-accent-gold-light to-bg-secondary rounded-xl p-4 border border-accent-gold/20',
          className
        )}
        role="timer"
        aria-live="polite"
        aria-label={`イベント開始まで ${timeRemaining.days}日 ${timeRemaining.hours}時間 ${timeRemaining.minutes}分 ${timeRemaining.seconds}秒`}
      >
        <div className="flex items-center justify-center gap-4">
          {timeRemaining.days > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary font-mono">
                {timeRemaining.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
                日
              </div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary font-mono">
              {timeRemaining.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
              時間
            </div>
          </div>

          <div className="text-text-muted text-xl font-bold">:</div>

          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary font-mono">
              {timeRemaining.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
              分
            </div>
          </div>

          <div className="text-text-muted text-xl font-bold">:</div>

          <div className="text-center">
            <div className="text-2xl font-bold text-accent-gold-dark font-mono animate-pulse">
              {timeRemaining.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
              秒
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={cn(
        'inline-flex items-center gap-3 px-4 py-2 bg-bg-accent/10 rounded-lg border border-surface-border',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`イベント開始まで ${timeRemaining.days}日 ${timeRemaining.hours}時間 ${timeRemaining.minutes}分 ${timeRemaining.seconds}秒`}
    >
      <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
      
      <div className="flex items-center gap-2 font-mono text-sm">
        {timeRemaining.days > 0 && (
          <>
            <span className="font-semibold text-text-primary">{timeRemaining.days}</span>
            <span className="text-text-muted">日</span>
          </>
        )}
        <span className="font-semibold text-text-primary">
          {timeRemaining.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-text-muted">:</span>
        <span className="font-semibold text-text-primary">
          {timeRemaining.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-text-muted">:</span>
        <span className="font-semibold text-accent-gold-dark">
          {timeRemaining.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

export default CountdownTimer;