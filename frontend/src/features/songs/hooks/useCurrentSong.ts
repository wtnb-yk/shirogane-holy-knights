'use client';

import { useState, useCallback } from 'react';
import { StreamSong } from '../types/types';

interface UseCurrentSongResult {
  currentSong: StreamSong | null;
  autoplay: boolean;
  setCurrentSong: (song: StreamSong | null) => void;
  changeCurrentSong: (song: StreamSong) => void;
  playSong: (song: StreamSong) => void;
  clearCurrentSong: () => void;
}

/**
 * 現在選択されている楽曲の状態管理フック
 */
export const useCurrentSong = (): UseCurrentSongResult => {
  const [currentSong, setCurrentSong] = useState<StreamSong | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  const changeCurrentSong = useCallback((song: StreamSong) => {
    setCurrentSong(song);
    setAutoplay(false); // 選択のみの場合は自動再生しない
  }, []);

  const playSong = useCallback((song: StreamSong) => {
    setCurrentSong(song);
    setAutoplay(true); // 再生ボタンの場合は自動再生
  }, []);

  const clearCurrentSong = useCallback(() => {
    setCurrentSong(null);
    setAutoplay(false);
  }, []);

  return {
    currentSong,
    autoplay,
    setCurrentSong,
    changeCurrentSong,
    playSong,
    clearCurrentSong,
  };
};