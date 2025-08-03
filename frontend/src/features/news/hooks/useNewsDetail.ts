'use client';

import { useState, useEffect } from 'react';
import { NewsDto } from '../types/types';

interface UseNewsDetailResult {
  news: NewsDto | null;
  loading: boolean;
  error: string | null;
}

/**
 * ニュース詳細を取得するフック
 */
export const useNewsDetail = (newsId: string): UseNewsDetailResult => {
  const [news, setNews] = useState<NewsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!newsId) {
      setError('ニュースIDが指定されていません');
      setLoading(false);
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/newsDetail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: newsId }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ニュースが見つかりませんでした');
          }
          throw new Error('ニュース詳細の取得に失敗しました');
        }

        const data: NewsDto = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  return { news, loading, error };
};