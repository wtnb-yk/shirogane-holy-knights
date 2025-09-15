'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ExternalLink, Calendar } from 'lucide-react';
import { Event } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!event) return null;

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

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.slice(0, 5); // HH:MM形式に変換
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            イベント詳細
          </DialogTitle>
          <DialogClose onClose={() => onClose()} />
        </DialogHeader>

        <div className="p-6 pt-0">
          <div className="space-y-6">
            {/* イベントタイトル */}
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-3 leading-tight">
                {event.title}
              </h3>

              {/* イベントタイプバッジ */}
              <div className="flex flex-wrap gap-2">
                {event.eventTypes.map((type) => (
                  <span
                    key={type.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeBadgeStyle(type.type)}`}
                  >
                    {getEventTypeLabel(type.type)}
                  </span>
                ))}
              </div>
            </div>

          {/* 日時情報 */}
          <div className="space-y-3 p-4 bg-bg-accent/10 rounded-lg border border-surface-border">
            <div className="flex items-center gap-3 text-text-primary">
              <Calendar className="w-5 h-5 text-text-secondary" />
              <span className="text-lg font-medium">
                {formatDate(event.eventDate)}
              </span>
            </div>

            {event.eventTime && (
              <div className="flex items-center gap-3 text-text-primary">
                <Clock className="w-5 h-5 text-text-secondary" />
                <span className="text-lg">
                  {formatTime(event.eventTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}

            {event.endDate && event.endDate !== event.eventDate && (
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="w-5 h-5" />
                <span>
                  終了日: {formatDate(event.endDate)}
                  {event.endTime && ` ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}
          </div>

          {/* 説明 */}
          {event.description && (
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-3">
                詳細
              </h4>
              <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* 画像 */}
          {event.imageUrl && (
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-3">
                画像
              </h4>
              <div className="flex justify-center">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={500}
                  height={256}
                  className="max-w-full max-h-64 rounded-lg shadow-md border border-surface-border"
                />
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-border">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-all duration-200 interactive-hover font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                詳細を確認
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-accent rounded-lg transition-all duration-200 interactive-hover"
            >
              閉じる
            </button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
