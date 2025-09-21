'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';
import { getAlbumTypeBadgeModalStyle } from '../utils/albumTypeBadgeStyles';
import { AlbumTypeDto } from '../types/types';

interface AlbumBasicInfoProps {
  title: string;
  artist: string;
  releaseDate?: string | null;
  albumType: AlbumTypeDto;
}

export const AlbumBasicInfo = ({
  title,
  artist,
  releaseDate,
  albumType
}: AlbumBasicInfoProps) => {
  return (
    <div className="flex-1">
      <div className="mb-3">
        <Badge variant="outline" className={`text-sm ${getAlbumTypeBadgeModalStyle(albumType.typeName)}`}>
          {getAlbumTypeDisplayName(albumType.typeName)}
        </Badge>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-text-inverse mb-2">
        {title}
      </h2>

      <p className="text-base sm:text-lg text-text-inverse mb-3 sm:mb-4">
        {artist}
      </p>

      {releaseDate && (
        <div className="flex items-center text-text-inverse mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <time dateTime={releaseDate}>
            {new Date(releaseDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      )}

    </div>
  );
};