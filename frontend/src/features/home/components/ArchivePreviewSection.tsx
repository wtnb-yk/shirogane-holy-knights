'use client';

import React from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { ArchivePreviewCard } from './ArchivePreviewCard';
import { SkeletonArchivePreviewCard } from './SkeletonArchivePreviewCard';

export default function ArchivePreviewSection() {
  const { videos, loading, error } = useVideos({
    pageSize: 6
  });

  return (
    <section className="py-16 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            配信アーカイブ
          </h2>
          <div className="w-20 h-1 bg-text-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            白銀ノエルさんの過去配信をチェック！
          </p>
        </div>

        {/* 動画一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonArchivePreviewCard key={index} index={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">
                動画の取得に失敗しました
              </p>
            </div>
          ) : videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <ArchivePreviewCard key={video.id} video={video} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-5xl mb-4">🎥</div>
              <p className="text-text-secondary">
                動画がありません
              </p>
            </div>
          )}
        </div>

        {/* すべてのアーカイブを見るボタン */}
        <div className="text-center">
          <a
            href="/videos"
            className="inline-flex items-center px-8 py-3 bg-bg-primary text-text-primary border border-surface-border rounded-lg font-medium hover:bg-bg-accent transition-colors duration-200"
          >
            すべてのアーカイブを見る
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
