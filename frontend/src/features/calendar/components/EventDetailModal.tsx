'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ChevronLeft } from 'lucide-react';
import { Event } from '../types';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { LinkText } from '@/components/ui/LinkText';
import { Badge } from '@/components/ui/badge';
import { getEventTypeBadgeStyle } from '../utils/eventBadgeStyles';
import { getImageUrl } from '@/utils/imageUrl';
import { IMAGE_STYLES } from '@/constants/styles';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  fromDayModal?: boolean;
  onBackToDayModal?: () => void;
}

export function EventDetailModal({ event, isOpen, onClose, fromDayModal = false, onBackToDayModal }: EventDetailModalProps) {
  if (!event) return null;


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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="space-y-2 sm:space-y-3 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-2">
          {fromDayModal && onBackToDayModal && (
            <button
              onClick={onBackToDayModal}
              className="text-white hover:text-gray-200 hover:bg-white/20 transition-all duration-200 flex items-center justify-center w-8 h-8 rounded -ml-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-white">
            イベント詳細
          </h2>
        </div>
        <div className="space-y-4 px-4 pt-2 pb-4">
          {/* イベントタイトル */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
              {event.title}
            </h3>

            {/* イベントタイプバッジ */}
            <div className="flex flex-wrap gap-2">
              {event.eventTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant="outline"
                  className={`cursor-default text-sm px-3 py-1.5 ${getEventTypeBadgeStyle(type.type, 'modal')}`}
                >
                  {getEventTypeLabel(type.type)}
                </Badge>
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
            <div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-5 h-5 text-gray-300" />
                <span className="text-lg font-semibold">
                  {formatTime(event.eventTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            </div>
          )}

          {/* 説明 */}
          {event.description && (
            <div>
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                {event.description}
                {event.url && (
                  <>
                    <br />
                    <span className="block text-right">
                      <LinkText href={event.url}>
                        詳細を見る
                      </LinkText>
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* 外部リンク（説明がない場合） */}
          {!event.description && event.url && (
            <div className="text-right">
              <LinkText href={event.url}>
                詳細はこちら
              </LinkText>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
