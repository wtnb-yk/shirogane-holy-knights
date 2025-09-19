'use client';

import { useState, useEffect } from 'react';
import { AlbumTypeDto } from '../types/types';

interface UseAlbumTypesResult {
  albumTypes: AlbumTypeDto[];
  loading: boolean;
  error: string | null;
}

export const useAlbumTypes = (): UseAlbumTypesResult => {
  const [albumTypes, setAlbumTypes] = useState<AlbumTypeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/albums/types`);

        if (!response.ok) {
          throw new Error('アルバムタイプ一覧の取得に失敗しました');
        }

        const data: AlbumTypeDto[] = await response.json();
        setAlbumTypes(data);
      }  finally {
        setLoading(false);
      }
    };

    fetchAlbumTypes();
  }, []);

  return { albumTypes, loading, error };
};