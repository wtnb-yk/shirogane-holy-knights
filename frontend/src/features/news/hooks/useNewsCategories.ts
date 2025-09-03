'use client';

import { useState, useEffect } from 'react';
import { NewsCategoryDto } from '../types/types';

interface UseNewsCategoriesResult {
  categories: NewsCategoryDto[];
  loading: boolean;
  error: string | null;
}

/**
 * ニュースカテゴリ一覧を取得するフック
 */
export const useNewsCategories = (): UseNewsCategoriesResult => {
  const [categories, setCategories] = useState<NewsCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/news/categories`);
        
        if (!response.ok) {
          throw new Error('カテゴリ一覧の取得に失敗しました');
        }

        const data: NewsCategoryDto[] = await response.json();
        setCategories(data);
      }  finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
