'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { ArchiveDto } from '@/api/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArchiveCardProps {
  archive: ArchiveDto;
  index: number;
}

const ArchiveCardComponent = ({ archive, index }: ArchiveCardProps) => {
  return (
    <div 
      className="h-full group opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sage-300/20 bg-white border border-sage-200 hover:scale-[1.02] hover:-translate-y-1">
        {archive.thumbnailUrl && (
          <div className="relative w-full h-48 overflow-hidden bg-sage-100">
            <Image 
              src={archive.thumbnailUrl} 
              alt={archive.title} 
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
          <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-800 group-hover:text-sage-300 transition-colors duration-200">
            {archive.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-sage-300 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(archive.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {archive.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-sage-100/50 text-gray-700 hover:bg-sage-100/70 transition-colors duration-200 border-sage-200/50"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {archive.tags && archive.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-sage-200/50 text-gray-600">
                +{archive.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <a
            href={archive.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sage-300 hover:text-gray-800 font-medium transition-all duration-300 hover:translate-x-2"
          >
            YouTubeで視聴
            <ExternalLink className="w-4 h-4" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

ArchiveCardComponent.displayName = 'ArchiveCard';

export const ArchiveCard = React.memo(ArchiveCardComponent);