'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Music } from 'lucide-react';
import { AlbumDto } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { OverlayIcon } from '@/components/ui/OverlayIcon';
import { getImageUrl } from '@/utils/imageUrl';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';

interface DiscographyCardProps {
  album: AlbumDto;
  index: number;
  onClick?: () => void;
}

const DiscographyCardComponent = ({ album, index, onClick }: DiscographyCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(album.coverImageUrl);

  const cardContent = (
    <InteractiveCard hoverScale="sm" className="border-0 rounded-lg bg-bg-primary overflow-hidden" onClick={onClick}>
      <div className="aspect-square relative mb-3">
        {/* カバー画像 */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={album.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-bg-secondary flex items-center justify-center rounded-lg">
            <Music className="w-12 h-12 text-text-muted" />
          </div>
        )}

        {/* オーバーレイアイコン */}
        <OverlayIcon type="play" className="absolute top-2 right-2" />
      </div>

      {/* アルバム情報 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {getAlbumTypeDisplayName(album.albumType.typeName)}
          </Badge>
        </div>

        <h3 className="font-bold text-text-primary text-sm mb-1 line-clamp-2">
          {album.title}
        </h3>

        <p className="text-text-secondary text-xs mb-2">
          {album.artist}
        </p>

        {album.releaseDate && (
          <div className="flex items-center text-text-muted text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <time dateTime={album.releaseDate}>
              {new Date(album.releaseDate).toLocaleDateString('ja-JP')}
            </time>
          </div>
        )}

        {/* トラック数表示 */}
        {album.tracks && album.tracks.length > 0 && (
          <div className="text-text-muted text-xs mt-2">
            {album.tracks.length} トラック
          </div>
        )}
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