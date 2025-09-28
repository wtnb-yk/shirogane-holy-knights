'use client';

import React from 'react';
import { Radio, Calendar } from 'lucide-react';
import { ArchiveCardTags } from './ArchiveCardTags';

interface ArchiveCardOverlayProps {
  title: string;
  date: string;
  tags?: string[];
  type: 'stream' | 'video';
}

export const ArchiveCardOverlay = ({
  title,
  date,
  tags,
  type
}: ArchiveCardOverlayProps) => {
  return (
    <>
      {/* 基本オーバーレイ */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
        <ArchiveCardTags
          tags={tags}
          maxVisible={1}
          variant="basic"
        />
      </div>

      {/* ホバー時詳細情報 */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        <div className={`absolute inset-x-0 bottom-0 p-3 ${
          type === 'video' ? 'transform translate-y-2 group-hover:translate-y-0' : ''
        }`}>
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
            {type === 'stream' ? (
              <Radio className="w-3 h-3" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            <span className={type === 'video' ? 'font-medium' : ''}>
              {date}
            </span>
          </div>
          {type === 'stream' && tags && tags.length > 1 && (
            <ArchiveCardTags
              tags={tags.slice(1)}
              maxVisible={2}
              variant="overlay"
            />
          )}
          {type === 'video' && (
            <ArchiveCardTags
              tags={tags}
              maxVisible={2}
              variant="overlay"
            />
          )}
        </div>
      </div>
    </>
  );
};
