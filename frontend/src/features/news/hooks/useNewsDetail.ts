'use client';

import { useState, useEffect } from 'react';
import { NewsDto } from '../types/types';
import { NewsClient } from '../api/newsClient';

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

        const data = await NewsClient.getNewsDetail({ id: newsId });
        setNews(data);
      } catch (err) {
        setError('ニュース詳細の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  return { news, loading, error };
};