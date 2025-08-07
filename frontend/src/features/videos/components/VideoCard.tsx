'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { VideoDto } from '../types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  video: VideoDto;
  index: number;
}

const VideoCardComponent = ({ video, index }: VideoCardProps) => {
  return (
    <a 
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${video.title}をYouTubeで視聴`}
      className="block h-full group opacity-0 animate-fade-in cursor-pointer" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-shirogane-text-secondary/20 bg-shirogane-bg-primary border border-shirogane-surface-border hover:scale-[1.02] hover:-translate-y-1">
        {video.thumbnailUrl && (
          <div className="relative w-full aspect-video overflow-hidden bg-shirogane-bg-accent">
            <Image 
              src={video.thumbnailUrl} 
              alt={video.title} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="text-base font-bold mb-3 line-clamp-3 text-shirogane-text-primary group-hover:text-shirogane-text-secondary transition-colors duration-200">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-shirogane-text-secondary mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-shirogane-bg-accent/50 text-shirogane-text-primary hover:bg-shirogane-bg-accent/70 transition-colors duration-200 border-shirogane-surface-border/50"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {video.tags && video.tags.length > 3 && (
              <div className="relative group/tooltip">
                <Badge variant="outline" className="text-xs border-shirogane-surface-border/50 text-shirogane-text-secondary">
                  +{video.tags.length - 3}
                </Badge>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-shirogane-bg-primary border border-shirogane-surface-border rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-shirogane-bg-accent/50 text-shirogane-text-primary text-xs border-shirogane-surface-border/50"
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
      </Card>
    </a>
  );
};

VideoCardComponent.displayName = 'VideoCard';

export const VideoCard = React.memo(VideoCardComponent);