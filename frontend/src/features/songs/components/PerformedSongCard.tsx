'use client';

import React from 'react';
import { Music, Calendar, Hash } from 'lucide-react';
import { PerformedSong, PerformanceType } from '../types/types';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';

interface PerformedSongCardProps {
  song: PerformedSong;
  index?: number;
}

const PerformedSongCardComponent = ({ song, index = 0 }: PerformedSongCardProps) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '日時不明';
    try {
      return new Date(dateStr).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '日時不明';
    }
  };

  const getPerformanceTypeLabel = (type: PerformanceType) => {
    return type === PerformanceType.STREAM ? '配信' : 'ライブ';
  };

  const getPerformanceTypeColor = (type: PerformanceType) => {
    return type === PerformanceType.STREAM ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400';
  };

  // 最新のパフォーマンスを取得（最初の1件のみ表示）
  const latestPerformance = song.performances[0];

  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={latestPerformance?.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${song.title} - ${song.artist}をYouTubeで視聴`}
        hoverScale="sm"
        className="song-card-hover rounded-lg overflow-hidden h-full"
      >
        <CardContent className="p-4 md:p-5 h-full flex flex-col">
          {/* ヘッダー部分 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-accent-gold/20 flex-shrink-0">
                <Music className="w-4 h-4 text-accent-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-text-primary font-semibold text-sm md:text-base line-clamp-2 group-hover:text-accent-gold transition-colors">
                  {song.title}
                </h3>
                <p className="text-text-secondary text-xs md:text-sm line-clamp-1">
                  {song.artist}
                </p>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-text-secondary">
              <Hash className="w-3 h-3" />
              <span className="text-xs font-medium">
                {song.singCount}回歌唱
              </span>
            </div>
            <div className="flex items-center space-x-1 text-text-secondary">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">
                {formatDate(song.latestSingDate)}
              </span>
            </div>
          </div>

          {/* 最新パフォーマンス情報 */}
          {latestPerformance && (
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 ${getPerformanceTypeColor(latestPerformance.performanceType as PerformanceType)}`}
                >
                  {getPerformanceTypeLabel(latestPerformance.performanceType as PerformanceType)}
                </Badge>
              </div>
              <p className="text-text-secondary text-xs line-clamp-2">
                {latestPerformance.videoTitle}
              </p>
            </div>
          )}

          {/* パフォーマンス数インジケーター */}
          {song.performances.length > 1 && (
            <div className="mt-2 text-center">
              <span className="text-xs text-text-secondary bg-surface-secondary rounded-full px-2 py-1">
                +{song.performances.length - 1}件のパフォーマンス
              </span>
            </div>
          )}
        </CardContent>
      </InteractiveCard>
    </StaggeredItem>
  );
};

export const PerformedSongCard = React.memo(PerformedSongCardComponent);