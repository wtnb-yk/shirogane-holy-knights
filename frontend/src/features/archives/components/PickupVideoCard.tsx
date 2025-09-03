'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Tag, Star } from 'lucide-react';
import { VideoDto } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { IMAGE_STYLES } from '@/constants/styles';

interface PickupVideoCardProps {
  video: VideoDto;
  index: number;
}

const PickupVideoCardComponent = ({ video, index }: PickupVideoCardProps) => {
  return (
    <StaggeredItem index={index} className="group col-span-1 md:col-span-2 md:row-span-2">
      <InteractiveCard
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${video.title}をYouTubeで視聴`}
        hoverScale="sm"
        className="rounded-lg overflow-hidden h-full relative"
      >
        {video.thumbnailUrl && (
          <div className="relative w-full aspect-video overflow-hidden bg-bg-accent">
            <Image 
              src={video.thumbnailUrl} 
              alt={video.title} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            
            {/* PICKUP バッジ */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none px-3 py-1 text-sm font-bold shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                PICKUP
              </Badge>
            </div>
            
            {/* ホバー時オーバーレイ（VideoCardと同じ） */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* ホバー時情報表示（VideoCardと同じ） */}
            <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{new Date(video.publishedAt).toLocaleDateString('ja-JP')}</span>
              </div>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 transition-colors text-xs px-2 py-0.5 border-none"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {video.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/10 text-white border-white/30">
                      +{video.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </InteractiveCard>
    </StaggeredItem>
  );
};

PickupVideoCardComponent.displayName = 'PickupVideoCard';

export const PickupVideoCard = React.memo(PickupVideoCardComponent);