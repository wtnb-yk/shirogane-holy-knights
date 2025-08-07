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
    <section className="py-16 bg-shirogane-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-shirogane-text-primary mb-2">
            配信アーカイブ
          </h2>
          <div className="w-20 h-1 bg-shirogane-text-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-shirogane-text-secondary max-w-2xl mx-auto">
            白銀ノエルさんの過去配信をチェックしよう
          </p>
        </div>

        {/* 動画一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} index={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-shirogane-text-secondary">
                動画の取得に失敗しました
              </p>
            </div>
          ) : videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-5xl mb-4">🎥</div>
              <p className="text-shirogane-text-secondary">
                動画がありません
              </p>
            </div>
          )}
        </div>

        {/* アーカイブ統計情報 */}
        {totalCount > 0 && (
          <div className="bg-shirogane-bg-accent/20 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-shirogane-bg-primary rounded-lg border border-shirogane-surface-border p-6">
                <div className="text-3xl font-bold text-shirogane-text-secondary mb-2">
                  {totalCount.toLocaleString()}
                </div>
                <div className="text-shirogane-text-secondary text-sm font-medium">総配信数</div>
              </div>
              <div className="bg-shirogane-bg-primary rounded-lg border border-shirogane-surface-border p-6">
                <div className="text-3xl font-bold text-shirogane-text-secondary mb-2">
                  {Math.round(totalCount / 12)} ヶ月
                </div>
                <div className="text-shirogane-text-secondary text-sm font-medium">配信期間（推定）</div>
              </div>
              <div className="bg-shirogane-bg-primary rounded-lg border border-shirogane-surface-border p-6">
                <div className="text-3xl font-bold text-shirogane-text-secondary mb-2">
                  ∞
                </div>
                <div className="text-shirogane-text-secondary text-sm font-medium">団員の愛</div>
              </div>
            </div>
          </div>
        )}

        {/* すべてのアーカイブを見るボタン */}
        <div className="text-center">
          <a
            href="/videos"
            className="inline-flex items-center px-8 py-3 bg-shirogane-bg-primary text-shirogane-text-primary border border-shirogane-surface-border rounded-lg font-medium hover:bg-shirogane-bg-accent transition-colors duration-200"
          >
            すべてのアーカイブを見る
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}