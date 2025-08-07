'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { VideoDto } from '../types/types';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { TEXT_CLAMP, IMAGE_STYLES, BACKGROUND_OPACITY } from '@/constants/styles';

interface VideoCardProps {
  video: VideoDto;
  index: number;
}

const VideoCardComponent = ({ video, index }: VideoCardProps) => {
  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${video.title}をYouTubeで視聴`}
        hoverScale="md"
        className="video-card-hover rounded-lg overflow-hidden"
      >
        {video.thumbnailUrl && (
          <div className="relative w-full aspect-video overflow-hidden bg-bg-accent">
            <Image 
              src={video.thumbnailUrl} 
              alt={video.title} 
              fill
              className="object-cover image-hover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <div className="image-overlay" />
          </div>
        )}
        <CardContent className="p-5">
          <h3 className={`text-base font-bold mb-3 ${TEXT_CLAMP[3]} text-text-primary group-hover:text-text-secondary transition-colors duration-ui`}>
            {video.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`${BACKGROUND_OPACITY.accent.strong} text-text-primary hover:bg-bg-accent/70 transition-colors duration-ui ${BACKGROUND_OPACITY.surface.light}`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {video.tags && video.tags.length > 3 && (
              <div className="relative group/tooltip">
                <Badge variant="outline" className={`text-xs ${BACKGROUND_OPACITY.surface.light} text-text-secondary`}>
                  +{video.tags.length - 3}
                </Badge>
                <div className="tooltip-base">
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`${BACKGROUND_OPACITY.accent.strong} text-text-primary text-xs ${BACKGROUND_OPACITY.surface.light}`}
                      >
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </InteractiveCard>
    </StaggeredItem>
  );
};

VideoCardComponent.displayName = 'VideoCard';

export const VideoCard = React.memo(VideoCardComponent);