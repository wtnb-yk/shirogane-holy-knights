'use client';

import React from 'react';
import { StreamSong, Performance } from '@/features/songs/types/types';
import { DynamicResponsiveModal } from '@/components/Misc';
import { useViewport } from '@/hooks/useViewport';
import { SongBasicInfo } from './internals/SongBasicInfo';
import { SongPerformanceList } from '../lists/SongPerformanceList';

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
  const { isDesktop, isLoaded } = useViewport();

  if (!song) return null;

  // SSRハイドレーション対応：初回レンダリング時はデスクトップ表示
  const shouldUseDesktopLayout = !isLoaded || isDesktop;

  return (
    <DynamicResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={"楽曲詳細"}
      className={shouldUseDesktopLayout ? "space-y-4 sm:space-y-6" : ""}
    >
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
    </DynamicResponsiveModal>
  );
};
