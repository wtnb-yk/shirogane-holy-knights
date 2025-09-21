'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';
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
        <Badge variant="secondary" className="text-sm">
          {getAlbumTypeDisplayName(albumType.typeName)}
        </Badge>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
        {title}
      </h2>

      <p className="text-base sm:text-lg text-text-secondary mb-3 sm:mb-4">
        {artist}
      </p>

      {releaseDate && (
        <div className="flex items-center text-text-muted mb-4">
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

      {albumType.description && (
        <p className="text-text-secondary text-sm">
          {albumType.description}
        </p>
      )}
    </div>
  );
};