'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import { Calendar, Music, ExternalLink } from 'lucide-react';
import { AlbumDto } from '../types/types';
import { Badge } from '@/components/Badge/badge';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';
import { getAlbumTypeBadgeStyle } from '../utils/albumTypeBadgeStyles';
import { formatDateSimple } from '@/utils/componentUtils';

interface DiscographyCardProps {
  album: AlbumDto;
  index: number;
  onClick?: () => void;
}

const DiscographyCardComponent = ({ album, index, onClick }: DiscographyCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(album.coverImageUrl);

  const cardContent = (
    <InteractiveCard hoverScale="sm" className="border-0 bg-bg-primary" onClick={onClick}>
      <div className="aspect-square relative mb-3 overflow-hidden rounded-lg group">
        {/* カバー画像 */}
        {imageUrl ? (
          <OptimizedImage
            src={imageUrl}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
            <Music className="w-12 h-12 text-text-muted" />
          </div>
        )}

        {/* オーバーレイアイコン - ホバー時のみ表示 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="rounded-full bg-white/90 p-1">
            <ExternalLink className="w-6 h-6 text-text-primary" />
          </div>
        </div>
      </div>

      {/* アルバム情報 */}
      <div className="p-3">
        <Badge
          variant="outline"
          className={`text-xs mb-1.5 border ${getAlbumTypeBadgeStyle(album.albumType.typeName, 'light')}`}
        >
          {getAlbumTypeDisplayName(album.albumType.typeName)}
        </Badge>

        <h3 className="font-bold text-text-primary text-base mb-0.5 line-clamp-2">
          {album.title}
        </h3>

        <p className="text-text-secondary text-sm mb-1.5">
          {album.artist}
        </p>

        <div className="flex items-center justify-between text-xs text-text-muted">
          {album.releaseDate && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <time dateTime={album.releaseDate}>
                {formatDateSimple(album.releaseDate)}
              </time>
            </div>
          )}

          {album.tracks && album.tracks.length > 0 && (
            <span>{album.tracks.length} トラック</span>
          )}
        </div>
      </div>
    </InteractiveCard>
  );

  return (
    <StaggeredItem index={index}>
      {cardContent}
    </StaggeredItem>
  );
};

export const DiscographyCard = React.memo(DiscographyCardComponent);