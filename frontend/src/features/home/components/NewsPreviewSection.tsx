import React from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { NewsCard } from '@/features/news/components/NewsCard';
import { SkeletonNewsCard } from '@/features/news/components/SkeletonNewsCard';

export default function NewsPreviewSection() {
  const { news, loading, error } = useNews({ 
    pageSize: 3
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-section-enter">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-noel-text-primary mb-4">
              最新ニュース
            </h2>
            <p className="text-lg text-noel-text-secondary">
              白銀ノエルさんに関する最新情報をお届けします
            </p>
          </div>

          {/* ニュース一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              // ローディング状態
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonNewsCard key={index} index={index} />
              ))
            ) : error ? (
              // エラー状態
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">😔</div>
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
                    animationDelay: `${index * 100}ms`,
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
              className="inline-flex items-center px-8 py-4 bg-noel-primary text-white rounded-lg font-semibold hover:bg-noel-primary/90 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
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