'use client';

import React from 'react';
import { NewsCard } from '@/features/news/components/NewsCard';
import { SkeletonNewsCard } from '@/features/news/components/SkeletonNewsCard';
import { useNews } from '@/features/news/hooks/useNews';

export default function NewsPreviewSection() {
  const { news, loading, error } = useNews({ 
    pageSize: 3
  });

  return (
    <section className="py-16 bg-shirogane-bg-accent/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            最新ニュース
          </h2>
          <div className="w-20 h-1 bg-shirogane-text-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            白銀ノエルさんに関する最新情報をお届けします
          </p>
        </div>

        {/* ニュース一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonNewsCard key={index} index={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">
                ニュースの取得に失敗しました
              </p>
            </div>
          ) : news && news.length > 0 ? (
            news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-gray-600">
                ニュースがありません
              </p>
            </div>
          )}
        </div>

        {/* すべてのニュースを見るボタン */}
        <div className="text-center">
          <a
            href="/news"
            className="inline-flex items-center px-8 py-3 bg-white text-gray-800 border border-shirogane-surface-border rounded-lg font-medium hover:bg-shirogane-bg-accent transition-colors duration-200"
          >
            すべてのニュースを見る
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}