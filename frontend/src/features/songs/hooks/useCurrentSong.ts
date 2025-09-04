'use client';

import { useState, useCallback } from 'react';
import { StreamSong } from '../types/types';

interface UseCurrentSongResult {
  currentSong: StreamSong | null;
  setCurrentSong: (song: StreamSong | null) => void;
  changeCurrentSong: (song: StreamSong) => void;
  clearCurrentSong: () => void;
}

/**
 * 現在選択されている楽曲の状態管理フック
 */
export const useCurrentSong = (): UseCurrentSongResult => {
  const [currentSong, setCurrentSong] = useState<StreamSong | null>(null);

  const changeCurrentSong = useCallback((song: StreamSong) => {
    setCurrentSong(song);
  }, []);

  const clearCurrentSong = useCallback(() => {
    setCurrentSong(null);
  }, []);

  return {
    currentSong,
    setCurrentSong,
    changeCurrentSong,
    clearCurrentSong,
  };
};