'use client';

import React from 'react';
import Image from 'next/image';
import { Radio, Tag } from 'lucide-react';
import { StreamDto } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { IMAGE_STYLES } from '@/constants/styles';

interface StreamCardProps {
  stream: StreamDto;
  index: number;
}

const StreamCardComponent = ({ stream, index }: StreamCardProps) => {
  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${stream.title}をYouTubeで視聴`}
        hoverScale="sm"
        className="overflow-hidden h-full"
      >
        {stream.thumbnailUrl ? (
          <div className="relative w-full aspect-video overflow-hidden bg-black">
            <Image 
              src={stream.thumbnailUrl} 
              alt={stream.title} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            
            {/* オーバーレイ情報 */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-1">
                {stream.tags && stream.tags.length > 0 && (
                  <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                    {stream.tags[0]}
                  </span>
                )}
              </div>
            </div>
            
            {/* ホバー時詳細情報 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                  {stream.title}
                </h3>
                <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                  <Radio className="w-3 h-3" />
                  <span>
                    {stream.startedAt 
                      ? new Date(stream.startedAt).toLocaleDateString('ja-JP') 
                      : '配信日未定'
                    }
                  </span>
                </div>
                {stream.tags && stream.tags.length > 1 && (
                  <div className="flex flex-wrap gap-1">
                    {stream.tags.slice(1, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30 transition-colors text-xs px-2 py-0.5 border-none"
                      >
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {stream.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/10 text-white border-white/30">
                        +{stream.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400 flex items-center justify-center">
            <div className="text-white text-sm font-medium text-center px-4">
              サムネイル画像
            </div>
            
            {/* プレースホルダーオーバーレイ */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-1">
                {stream.tags && stream.tags.length > 0 && (
                  <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                    {stream.tags[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </InteractiveCard>
    </StaggeredItem>
  );
};

StreamCardComponent.displayName = 'StreamCard';

export const StreamCard = React.memo(StreamCardComponent);
