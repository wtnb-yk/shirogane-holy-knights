'use client';

import React from 'react';
import { VideoDto } from '../../types/types';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { ArchiveCardImage } from './internals/ArchiveCardImage';
import { ArchiveCardOverlay } from './internals/ArchiveCardOverlay';
import { formatDateSimple } from '@/utils/componentUtils';

interface VideoCardProps {
  video: VideoDto;
  index: number;
}

const VideoCardComponent = ({ video, index }: VideoCardProps) => {
  const date = formatDateSimple(video.publishedAt);

  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${video.title}をYouTubeで視聴`}
        hoverScale="sm"
        className="h-full"
      >
        {video.thumbnailUrl && (
          <div className="relative">
            <ArchiveCardImage
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* ホバー時オーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <ArchiveCardOverlay
              title={video.title}
              date={date}
              tags={video.tags}
              type="video"
            />
          </div>
        )}
      </InteractiveCard>
    </StaggeredItem>
  );
};

VideoCardComponent.displayName = 'VideoCard';

export const VideoCard = React.memo(VideoCardComponent);
