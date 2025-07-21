'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LambdaClient } from '@/api/lambdaClient';
import { ArchiveDto } from '@/api/types';

interface Archive {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  tags: string[];
}

export default function ArchivesList() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        
        // Lambda関数を使用してアーカイブを取得
        console.log('Lambda関数を使用してアーカイブを取得します...');
        
        // アーカイブ検索関数を呼び出し
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: 1,
          pageSize: 20
        });
        
        console.log('Lambda API response:', searchResult);
        setArchives(searchResult.items);
        setLoading(false);
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        setLoading(false);
        console.error('Error fetching archives:', err);
      }
    };

    fetchArchives();
  }, []);

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
                {archive.tags.map((tag) => (
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
    </div>
  );
}