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
        // TODO: アルバムタイプ取得APIの実装
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album-types`);
        // const albumTypes = await response.json();
        // setAlbumTypes(albumTypes);

        // 仮のダミーデータ
        setAlbumTypes([
          { id: 1, name: 'オリジナルアルバム', description: 'オリジナル楽曲アルバム' },
          { id: 2, name: 'シングル', description: 'シングルリリース' },
          { id: 3, name: 'コンピレーション', description: 'コンピレーションアルバム' },
          { id: 4, name: 'ライブアルバム', description: 'ライブ録音アルバム' }
        ]);
      } catch (err) {
        setError('アルバムタイプの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumTypes();
  }, []);

  return { albumTypes, loading, error };
};