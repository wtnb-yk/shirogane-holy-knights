'use client';

import React from 'react';
import { StreamSong, Performance } from '@/features/songs/types/types';
import { ResponsiveModal } from '@/components/ui/ResponsiveModal';
import { useViewport } from '@/hooks/useViewport';
import { SongBasicInfo } from './internals/SongBasicInfo';
import { SongPerformanceList } from '../lists/SongPerformanceList';
import { SongDetailBottomSheetLayout } from '../layout/internals/SongDetailBottomSheetLayout';

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
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={song.title}
      className={shouldUseDesktopLayout ? "space-y-4 sm:space-y-6" : ""}
    >
      {shouldUseDesktopLayout ? (
        // デスクトップレイアウト：従来通り
        <>
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
        </>
      ) : (
        // モバイルレイアウト：BottomSheet最適化レイアウト
        <SongDetailBottomSheetLayout
          song={song}
          onPerformancePlay={onPerformancePlay}
          onClose={onClose}
        />
      )}
    </ResponsiveModal>
  );
};
