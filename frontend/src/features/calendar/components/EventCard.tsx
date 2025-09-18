'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Event } from '../types';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { Badge } from '@/components/ui/badge';
import { OverlayIcon } from '@/components/ui/OverlayIcon';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const getEventTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'event':
        return 'secondary' as const;
      case 'goods':
        return 'outline' as const;
      case 'campaign':
        return 'default' as const;
      default:
        return 'secondary' as const;
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

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.slice(0, 5); // HH:MM形式に変換
  };

  const formatDate = (dateString: string, includeWeekday = false) => {
    const date = new Date(dateString);
    if (includeWeekday) {
      return date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        weekday: 'short'
      });
    }
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    });
  };

  if (compact) {
    // カレンダーグリッド内の小さい表示
    const primaryEventType = event.eventTypes[0];

    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick(event);
        }}
        className={`w-full text-left px-1.5 py-1 rounded text-xs transition-all duration-200 hover:shadow-sm ${
          primaryEventType?.type === 'event'
            ? 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
            : primaryEventType?.type === 'goods'
            ? 'bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20'
            : 'bg-badge-green/10 text-badge-green hover:bg-badge-green/20'
        }`}
      >
        <div className="truncate font-medium text-xs">
          {event.title}
        </div>
        {event.eventTime && (
          <div className="flex items-center gap-1 mt-0.5 text-xs opacity-75">
            <Clock className="w-3 h-3" />
            <span>{formatTime(event.eventTime)}</span>
          </div>
        )}
      </button>
    );
  }

  // 詳細表示（リスト表示等で使用）
  return (
    <InteractiveCard
      hoverScale="sm"
      className="border-0 rounded-lg bg-bg-primary overflow-hidden cursor-pointer"
      onClick={() => onClick(event)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary flex-1 leading-tight">
            {event.title}
          </h3>
          {event.url && (
            <OverlayIcon
              type="external-link"
              isVisible={false}
              className="group-hover:opacity-100 ml-2"
            />
          )}
        </div>

        {/* イベントタイプバッジ */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.eventTypes.map((type) => (
            <Badge
              key={type.id}
              variant={getEventTypeBadgeVariant(type.type)}
              className="text-xs"
            >
              {getEventTypeLabel(type.type)}
            </Badge>
          ))}
        </div>

        {/* 日時情報 */}
        <div className="text-sm text-text-secondary mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {formatDate(event.eventDate, true)}
            </span>
            {event.eventTime && (
              <>
                <Clock className="w-4 h-4" />
                <span>{formatTime(event.eventTime)}</span>
              </>
            )}
          </div>
        </div>

        {/* 説明 */}
        {event.description && (
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>
    </InteractiveCard>
  );
}