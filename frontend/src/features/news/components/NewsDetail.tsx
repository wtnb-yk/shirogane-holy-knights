'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { NewsDto } from '../types/types';
import { Badge } from '@/components/ui/badge';

interface NewsDetailProps {
  news: NewsDto;
}

// カテゴリバッジのスタイル
const getCategoryBadgeStyle = (categoryName: string) => {
  switch (categoryName) {
    case 'GOODS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'COLLABORATION':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'EVENT':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'MEDIA':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-sage-100 text-sage-800 border-sage-200';
  }
};

export const NewsDetail = ({ news }: NewsDetailProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* パンくずリスト */}
      <nav className="mb-6 opacity-0 animate-slide-up">
        <div className="flex items-center space-x-2 text-sm text-sage-300">
          <Link 
            href="/news" 
            className="hover:text-gray-800 transition-colors duration-200"
          >
            ニュース
          </Link>
          <span>/</span>
          <span className="text-gray-600">{news.categoryDisplayName}</span>
        </div>
      </nav>

      {/* 戻るボタン */}
      <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sage-300 hover:text-gray-800 font-medium transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          一覧に戻る
        </Link>
      </div>

      {/* メインコンテンツ */}
      <article className="bg-white border border-sage-200 rounded-lg overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {/* サムネイル画像 */}
        {news.thumbnailUrl && (
          <div className="relative w-full h-64 md:h-80 bg-sage-100">
            <Image
              src={news.thumbnailUrl}
              alt={news.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* カテゴリと日付 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className={`border ${getCategoryBadgeStyle(news.categoryName)}`}
            >
              {news.categoryDisplayName}
            </Badge>
            <div className="flex items-center gap-2 text-sage-300">
              <Calendar className="w-4 h-4" />
              <time dateTime={news.publishedAt}>
                {new Date(news.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
            {news.title}
          </h1>

          {/* 本文 */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 外部リンク */}
          {news.externalUrl && (
            <div className="mt-8 pt-6 border-t border-sage-200">
              <a
                href={news.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage-300 text-white rounded-lg hover:bg-sage-400 transition-all duration-200 hover:scale-105"
              >
                外部リンクを開く
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </article>

      {/* 前後のニュースナビゲーション */}
      <div className="mt-8 flex justify-between items-center opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex-1">
          {/* 実際の実装では前のニュースのIDを取得する必要があります */}
        </div>
        <div className="flex-1 text-right">
          {/* 実際の実装では次のニュースのIDを取得する必要があります */}
        </div>
      </div>
    </div>
  );
};