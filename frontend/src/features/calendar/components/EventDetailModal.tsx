'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ExternalLink, ChevronLeft } from 'lucide-react';
import { Event } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from '@/components/ui/modal';
import { getImageUrl } from '@/utils/imageUrl';
import { IMAGE_STYLES } from '@/constants/styles';
import {Button} from "@/components/ui/Button";

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  fromDayModal?: boolean;
  onBackToDayModal?: () => void;
}

export function EventDetailModal({ event, isOpen, onClose, fromDayModal = false, onBackToDayModal }: EventDetailModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {fromDayModal && onBackToDayModal && (
              <button
                onClick={onBackToDayModal}
                className="text-text-secondary hover:text-text-primary hover:bg-bg-accent/10 transition-all duration-200 flex items-center justify-center w-8 h-8 rounded -ml-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle>
              イベント詳細
            </DialogTitle>
          </div>
          <DialogClose onClose={() => onClose()} />
        </DialogHeader>
        <DialogBody>
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

          {/* 画像 */}
          {event.imageUrl && getImageUrl(event.imageUrl) && (
            <div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-2xl aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(event.imageUrl)!}
                    alt={event.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_STYLES.placeholder}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 時刻情報 */}
          {event.eventTime && (
            <div className="p-4 bg-bg-accent/10 rounded-lg border border-surface-border">
              <div className="flex items-center gap-3 text-text-primary">
                <Clock className="w-5 h-5 text-text-secondary" />
                <span className="text-lg">
                  {formatTime(event.eventTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            </div>
          )}

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


          {/* アクションボタン */}
          {event.url && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-border">
              <Button
                variant="primary"
                onClick={() => window.open(event.url, '_blank', 'noopener noreferrer')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                詳細を確認
              </Button>
            </div>
          )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
