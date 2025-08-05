'use client';

import React from 'react';
import Image from 'next/image';
import { Radio, Tag } from 'lucide-react';
import { StreamDto } from '../types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StreamCardProps {
  stream: StreamDto;
  index: number;
}

const StreamCardComponent = ({ stream, index }: StreamCardProps) => {
  return (
    <a 
      href={stream.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${stream.title}をYouTubeで視聴`}
      className="block h-full group opacity-0 animate-fade-in cursor-pointer" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sage-300/20 bg-white border border-sage-200 hover:scale-[1.02] hover:-translate-y-1">
        {stream.thumbnailUrl && (
          <div className="relative w-full aspect-video overflow-hidden bg-sage-100">
            <Image 
              src={stream.thumbnailUrl} 
              alt={stream.title} 
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
          <h3 className="text-base font-bold mb-3 line-clamp-3 text-gray-800 group-hover:text-sage-300 transition-colors duration-200">
            {stream.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-sage-300 mb-3">
            <Radio className="w-4 h-4" />
            <span>
              {stream.startedAt 
                ? new Date(stream.startedAt).toLocaleDateString('ja-JP') 
                : '配信日未定'
              }
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stream.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-sage-100/50 text-gray-700 hover:bg-sage-100/70 transition-colors duration-200 border-sage-200/50"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {stream.tags && stream.tags.length > 3 && (
              <div className="relative group/tooltip">
                <Badge variant="outline" className="text-xs border-sage-200/50 text-gray-600">
                  +{stream.tags.length - 3}
                </Badge>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {stream.tags.slice(3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-sage-100/50 text-gray-700 text-xs border-sage-200/50"
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

StreamCardComponent.displayName = 'StreamCard';

export const StreamCard = React.memo(StreamCardComponent);