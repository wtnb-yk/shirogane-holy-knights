'use client';

import React from 'react';
import { StreamSong, Performance } from '../types/types';
import { Modal, ModalContent } from '@/components/ui/Modal';
import { SongBasicInfo } from './SongBasicInfo';
import { SongPerformanceList } from './SongPerformanceList';

interface SongDetailModalProps {
  song: StreamSong | null;
  isOpen: boolean;
  onClose: () => void;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
}

export const SongDetailModal = ({
  song,
  isOpen,
  onClose,
  onPerformancePlay
}: SongDetailModalProps) => {
  if (!song) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SongBasicInfo
          title={song.title}
          artist={song.artist}
          singCount={song.singCount}
          latestSingDate={song.latestSingDate}
        />

        <SongPerformanceList
          performances={song.performances}
          onPerformancePlay={onPerformancePlay}
          onClose={onClose}
          song={song}
        />
      </ModalContent>
    </Modal>
  );
};
