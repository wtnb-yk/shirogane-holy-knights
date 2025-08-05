'use client';

import { useMemo } from 'react';
import {StreamDto, VideoDto} from '../types/types';

interface UseAvailableTagsResult {
  availableTags: string[];
}

/**
 * 動画から利用可能なタグを抽出するhook
 * @param videos 動画データ配列
 */
export const useAvailableTags = (videos: (VideoDto | StreamDto)[]): UseAvailableTagsResult => {
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    
    videos.forEach(video => {
      video.tags?.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  }, [videos]);

  return {
    availableTags,
  };
};
