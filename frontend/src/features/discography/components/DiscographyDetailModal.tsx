'use client';

import React from 'react';
import { AlbumDto } from '../types/types';
import { Modal } from '@/components/ui/Modal';
import { AlbumCoverImage } from './AlbumCoverImage';
import { AlbumBasicInfo } from './AlbumBasicInfo';
import { AlbumTrackList } from './AlbumTrackList';
import { AlbumPlatformLinks } from './AlbumPlatformLinks';

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

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={album.title}
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <AlbumCoverImage
              coverImageUrl={album.coverImageUrl}
              title={album.title}
            />
          </div>

          <AlbumBasicInfo
            title={album.title}
            artist={album.artist}
            releaseDate={album.releaseDate}
            albumType={album.albumType}
          />
        </div>

        <AlbumTrackList tracks={album.tracks || []} />

        <AlbumPlatformLinks albumReleases={album.albumReleases || []} />
      </div>
    </Modal>
  );
};
