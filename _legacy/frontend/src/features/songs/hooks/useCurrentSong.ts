'use client';

import { useState, useCallback } from 'react';
import { StreamSong, Performance } from '../types/types';

interface UseCurrentSongResult {
  currentSong: StreamSong | null;
  currentPerformance: Performance | null;
  autoplay: boolean;
  setCurrentSong: (song: StreamSong | null) => void;
  changeCurrentSong: (song: StreamSong) => void;
  playSong: (song: StreamSong, performance?: Performance) => void;
  clearCurrentSong: () => void;
}

/**
 * 現在選択されている楽曲の状態管理フック
 */
export const useCurrentSong = (): UseCurrentSongResult => {
  const [currentSong, setCurrentSong] = useState<StreamSong | null>(null);
  const [currentPerformance, setCurrentPerformance] = useState<Performance | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  const changeCurrentSong = useCallback((song: StreamSong) => {
    setCurrentSong(song);
    setCurrentPerformance(song.performances[0] || null);
    setAutoplay(false); // 選択のみの場合は自動再生しない
  }, []);

  const playSong = useCallback((song: StreamSong, performance?: Performance) => {
    setCurrentSong(song);
    setCurrentPerformance(performance || song.performances[0] || null);
    setAutoplay(true); // 再生ボタンの場合は自動再生
  }, []);

  const clearCurrentSong = useCallback(() => {
    setCurrentSong(null);
    setCurrentPerformance(null);
    setAutoplay(false);
  }, []);

  return {
    currentSong,
    currentPerformance,
    autoplay,
    setCurrentSong,
    changeCurrentSong,
    playSong,
    clearCurrentSong,
  };
};