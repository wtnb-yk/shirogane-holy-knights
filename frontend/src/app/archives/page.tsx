'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LambdaClient } from '@/api/lambdaClient';
import { ArchiveDto } from '@/api/types';

export default function ArchivesList() {
  const [archives, setArchives] = useState<ArchiveDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        
        // アーカイブ検索関数を呼び出し
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize
        });
        setArchives(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        setLoading(false);
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        setLoading(false);
        console.error('Error fetching archives:', err);
      }
    };

    fetchArchives();
  }, [currentPage]);

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">配信アーカイブ一覧</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((archive) => (
          <div key={archive.id} className="border rounded-lg overflow-hidden shadow-lg">
            {archive.thumbnailUrl && (
              <div className="relative w-full h-48">
                <Image 
                  src={archive.thumbnailUrl} 
                  alt={archive.title} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{archive.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(archive.publishedAt).toLocaleDateString('ja-JP')}
              </p>
              <div className="mb-4">
                {archive.tags?.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #{tag}
                  </span>
                ))}
              </div>
              <a 
                href={archive.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                YouTubeで視聴する →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {archives.length === 0 && (
        <div className="text-center py-10">
          アーカイブが見つかりませんでした。
        </div>
      )}

      {/* ページネーション */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前
          </button>
          
          {/* ページ番号 */}
          {(() => {
            const totalPages = Math.ceil(totalCount / pageSize);
            const pages = [];
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);
            
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-2 text-sm font-medium border ${
                    i === currentPage
                      ? 'text-blue-600 bg-blue-50 border-blue-500'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!hasMore}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次
          </button>
        </div>
      )}

      {/* ページ情報表示 */}
      {totalCount > 0 && (
        <div className="text-center text-sm text-gray-600 mt-4">
          {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} / {totalCount} 件
        </div>
      )}
    </div>
  );
}