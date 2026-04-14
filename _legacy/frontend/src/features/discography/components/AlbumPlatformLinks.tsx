'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import { ExternalLink } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';
import { AlbumReleaseDto } from '../types/types';
import { formatDateSimple } from '@/utils/componentUtils';

interface AlbumPlatformLinksProps {
  albumReleases: AlbumReleaseDto[];
}

const PlatformLink = ({ release }: { release: AlbumReleaseDto }) => {
  const iconUrl = getImageUrl(release.platformIconUrl);

  return (
    <a
      href={release.platformUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
    >
      {iconUrl && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 relative flex-shrink-0">
          <OptimizedImage
            src={iconUrl}
            alt={release.platformName}
            fill
            className="object-contain"
            sizes="32px"
            priority={false}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm sm:text-base text-text-inverse truncate">
          {release.platformName}
        </div>
        <div className="text-xs sm:text-sm text-text-inverse">
          {formatDateSimple(release.releaseDate)}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-text-inverse" />
    </a>
  );
};

export const AlbumPlatformLinks = ({ albumReleases }: AlbumPlatformLinksProps) => {
  if (!albumReleases || albumReleases.length === 0) return null;

  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3">
        配信プラットフォーム
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {albumReleases.map((release) => (
          <PlatformLink key={release.id} release={release} />
        ))}
      </div>
    </div>
  );
};