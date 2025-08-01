'use client';

import { useMemo } from 'react';
import { ArchiveDto } from '../types/types';

interface UseAvailableTagsResult {
  availableTags: string[];
}

/**
 * アーカイブから利用可能なタグを抽出するhook
 * @param archives アーカイブデータ配列
 */
export const useAvailableTags = (archives: ArchiveDto[]): UseAvailableTagsResult => {
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    
    archives.forEach(archive => {
      archive.tags?.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  }, [archives]);

  return {
    availableTags,
  };
};