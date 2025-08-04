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
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="animate-section-enter">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              最新ニュース
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sage-300 to-blue-400 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              白銀ノエルさんに関する最新情報をお届けします
            </p>
          </div>

          {/* ニュース一覧 - PC版では大型カード混在 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6 xl:gap-8 mb-12 xl:mb-20">
            {loading ? (
              // ローディング状態
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonNewsCard key={index} index={index} />
              ))
            ) : error ? (
              // エラー状態
              <div className="col-span-full text-center py-12">
                <p className="text-noel-text-secondary">
                  ニュースの取得に失敗しました
                </p>
              </div>
            ) : news && news.length > 0 ? (
              // データ表示
              news.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <NewsCard news={item} index={index} />
                </div>
              ))
            ) : (
              // データなし状態
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-noel-text-secondary">
                  ニュースがありません
                </p>
              </div>
            )}
          </div>

          {/* すべてのニュースを見るボタン */}
          <div className="text-center">
            <a
              href="/news"
              className="inline-flex items-center px-8 py-4 xl:px-12 xl:py-6 bg-gradient-to-r from-sage-300 to-blue-400 text-white rounded-2xl font-semibold hover:from-sage-200 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl xl:text-lg xl:shadow-2xl"
            >
              すべてのニュースを見る
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}