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
    <section className="py-20 bg-noel-bg-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-section-enter">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-noel-text-primary mb-4">
              配信アーカイブ
            </h2>
            <p className="text-lg text-noel-text-secondary">
              白銀ノエルさんの過去配信をチェックしよう
            </p>
          </div>

          {/* 動画一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            <div className="bg-white rounded-xl p-8 mb-12 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-noel-primary mb-2">
                    {totalCount.toLocaleString()}
                  </div>
                  <div className="text-noel-text-secondary">総配信数</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-noel-secondary mb-2">
                    {Math.round(totalCount / 12)} ヶ月
                  </div>
                  <div className="text-noel-text-secondary">配信期間（推定）</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-noel-primary mb-2">
                    ∞
                  </div>
                  <div className="text-noel-text-secondary">団員の愛</div>
                </div>
              </div>
            </div>
          )}

          {/* すべてのアーカイブを見るボタン */}
          <div className="text-center">
            <a
              href="/videos"
              className="inline-flex items-center px-8 py-4 bg-noel-secondary text-white rounded-lg font-semibold hover:bg-noel-secondary/90 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
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