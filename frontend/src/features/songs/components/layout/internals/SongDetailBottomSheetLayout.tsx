'use client';

import React from 'react';
import { StreamSong, Performance } from '@/features/songs/types/types';
import { SongPerformanceList } from '../../lists/SongPerformanceList';
import { Music, Calendar } from 'lucide-react';

interface SongDetailBottomSheetLayoutProps {
  song: StreamSong;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose?: () => void;
}

export const SongDetailBottomSheetLayout = ({
  song,
  onPerformancePlay,
  onClose
}: SongDetailBottomSheetLayoutProps) => {
  const formatLatestDate = (dateString: string | null) => {
    if (!dateString) return '未記録';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 楽曲メタデータセクション */}
      <div className="p-2">
        <div className="space-y-2">
          {/* 楽曲タイトル */}
          <h1 className="text-lg font-bold text-text-primary leading-tight">
            {song.title}
          </h1>

          {/* アーティスト名 */}
          <p className="text-sm text-text-secondary">
            {song.artist}
          </p>

          {/* 統計情報 - 横並び */}
          <div className="flex items-center gap-4">
            {/* 歌唱回数 */}
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-text-tertiary" />
              <span className="text-sm text-text-primary">
                {song.singCount} 回歌唱
              </span>
            </div>

            {/* 最新歌唱日 */}
            {song.latestSingDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm text-text-primary">
                  {formatLatestDate(song.latestSingDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* パフォーマンスリストセクション - スクロール可能エリア */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <SongPerformanceList
            performances={song.performances}
            onPerformancePlay={onPerformancePlay}
            onClose={onClose}
            song={song}
            variant="mobile"
          />
        </div>
      </div>
    </div>
  );
};
