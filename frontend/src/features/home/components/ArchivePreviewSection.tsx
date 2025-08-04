'use client';

import React from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { VideoCard } from '@/features/videos/components/VideoCard';
import { SkeletonCard } from '@/features/videos/components/SkeletonCard';

export default function ArchivePreviewSection() {
  const { videos, loading, error, totalCount } = useVideos({ 
    pageSize: 6
  });

  return (
    <section className="py-20 xl:py-32 bg-noel-bg-light xl:bg-gradient-to-br xl:from-noel-bg-light xl:via-white xl:to-sage-50/30 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-section-enter">
          <div className="text-center mb-16 xl:mb-24">
            <h2 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-800 mb-4 xl:mb-6">
              配信アーカイブ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sage-300 to-blue-400 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              白銀ノエルさんの過去配信をチェックしよう
            </p>
          </div>

          {/* 動画一覧 - PC版では4列表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-6 xl:gap-8 mb-12 xl:mb-20">
            {loading ? (
              // ローディング状態
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))
            ) : error ? (
              // エラー状態
              <div className="col-span-full text-center py-12">
                <p className="text-noel-text-secondary">
                  動画の取得に失敗しました
                </p>
              </div>
            ) : videos && videos.length > 0 ? (
              // データ表示
              videos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <VideoCard key={video.id} video={video} index={index} />
                </div>
              ))
            ) : (
              // データなし状態
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-noel-text-secondary">
                  動画がありません
                </p>
              </div>
            )}
          </div>

          {/* アーカイブ統計情報 */}
          {totalCount > 0 && (
            <div className="bg-white rounded-3xl p-8 xl:p-12 mb-12 xl:mb-20 shadow-xl xl:shadow-2xl border border-gray-100 xl:border-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-gradient-to-br from-sage-50 to-blue-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-sage-300 mb-2">
                    {totalCount.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-medium">総配信数</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sage-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {Math.round(totalCount / 12)} ヶ月
                  </div>
                  <div className="text-gray-600 font-medium">配信期間（推定）</div>
                </div>
                <div className="bg-gradient-to-br from-sage-50 to-blue-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-sage-300 mb-2">
                    ∞
                  </div>
                  <div className="text-gray-600 font-medium">団員の愛</div>
                </div>
              </div>
            </div>
          )}

          {/* すべてのアーカイブを見るボタン */}
          <div className="text-center">
            <a
              href="/videos"
              className="inline-flex items-center px-8 py-4 xl:px-12 xl:py-6 bg-gradient-to-r from-blue-400 to-sage-300 text-white rounded-2xl font-semibold hover:from-blue-500 hover:to-sage-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl xl:text-lg xl:shadow-2xl"
            >
              すべてのアーカイブを見る
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
