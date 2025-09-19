'use client';

import React from 'react';
import { AlbumDto } from '../types/types';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Calendar, Music, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUrl';

interface DiscographyDetailModalProps {
  album: AlbumDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DiscographyDetailModal = ({
  album,
  isOpen,
  onClose
}: DiscographyDetailModalProps) => {
  if (!album) return null;

  const imageUrl = getImageUrl(album.coverImageUrl);

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className="space-y-6">
        {/* アルバム基本情報 */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* カバー画像 */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 relative rounded-lg overflow-hidden bg-bg-secondary">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-16 h-16 text-text-muted" />
                </div>
              )}
            </div>
          </div>

          {/* アルバム情報 */}
          <div className="flex-1">
            <div className="mb-3">
              <Badge variant="secondary" className="text-sm">
                {album.albumType.name}
              </Badge>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {album.title}
            </h2>

            <p className="text-lg text-text-secondary mb-4">
              {album.artist}
            </p>

            {album.releaseDate && (
              <div className="flex items-center text-text-muted mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={album.releaseDate}>
                  {new Date(album.releaseDate).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}

            {album.albumType.description && (
              <p className="text-text-secondary text-sm">
                {album.albumType.description}
              </p>
            )}
          </div>
        </div>

        {/* トラックリスト */}
        {album.tracks && album.tracks.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-3">
              トラックリスト ({album.tracks.length} 曲)
            </h3>
            <div className="space-y-2">
              {album.tracks.map((track) => (
                <div
                  key={track.songId}
                  className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg"
                >
                  <div className="text-text-muted text-sm font-medium w-8 text-center">
                    {track.trackNumber}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      {track.title}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {track.artist}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 配信プラットフォーム */}
        {album.musicReleases && album.musicReleases.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-3">
              配信プラットフォーム
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {album.musicReleases.map((release) => (
                <a
                  key={release.id}
                  href={release.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  {release.platformIconUrl && (
                    <div className="w-8 h-8 relative">
                      <Image
                        src={getImageUrl(release.platformIconUrl) || ''}
                        alt={release.platformName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      {release.platformName}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {new Date(release.releaseDate).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};