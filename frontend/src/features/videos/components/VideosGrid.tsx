'use client';

import React from 'react';
import { VideoDto } from '../types/types';
import { VideoCard } from './VideoCard';
import { SkeletonCard } from './SkeletonCard';

interface VideosGridProps {
  videos: VideoDto[];
  loading: boolean;
  error?: string | null;
}

export const VideosGrid = ({ videos, loading, error }: VideosGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl text-gray-600">動画が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  );
};