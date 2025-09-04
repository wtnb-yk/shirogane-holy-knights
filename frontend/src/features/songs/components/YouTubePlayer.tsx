'use client';

import React from 'react';
import YouTube from 'react-youtube';
import { StreamSong } from '../types/types';

interface YouTubePlayerProps {
  song: StreamSong;
  onStateChange?: (event: any) => void;
}

export const YouTubePlayer = ({ song, onStateChange }: YouTubePlayerProps) => {
  const latestPerformance = song.performances[0];
  
  if (!latestPerformance?.videoId) {
    return (
      <div className="aspect-video bg-bg-secondary rounded-lg flex items-center justify-center">
        <p className="text-text-secondary">動画が見つかりません</p>
      </div>
    );
  }

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      // 関連動画を非表示
      rel: 0,
      // モデストブランディング
      modestbranding: 1,
      // プレイヤーコントロールを表示
      controls: 1,
      // 楽曲開始位置から再生
      start: latestPerformance.startSeconds,
    },
  };

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <YouTube
        videoId={latestPerformance.videoId}
        opts={opts}
        onStateChange={onStateChange}
        className="w-full h-full"
      />
    </div>
  );
};
