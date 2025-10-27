'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SpecialEventDetail } from '@/features/specials/components/details/SpecialEventDetail';
import { useSpecialEventDetail } from '@/features/specials/hooks/useSpecialEventDetail';
import { ErrorDisplay } from '@/components/Error';

/**
 * スペシャルイベント詳細ページコンポーネント
 */
export default function SpecialEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { eventDetail, loading, error } = useSpecialEventDetail(eventId);

  const handleBack = () => {
    router.push('/specials');
  };

  if (loading) {
    return (
      <PageLayout
        title="企画"
        description={<p>読み込み中...</p>}
        breadcrumbItems={[
          { name: 'ホーム', url: 'https://www.noe-room.com/' },
          { name: 'スペシャル', url: 'https://www.noe-room.com/specials' },
          { name: '詳細', url: `https://www.noe-room.com/specials/${eventId}` }
        ]}
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="企画"
        description={<p>エラーが発生しました</p>}
        breadcrumbItems={[
          { name: 'ホーム', url: 'https://www.noe-room.com/' },
          { name: 'スペシャル', url: 'https://www.noe-room.com/specials' },
          { name: '詳細', url: `https://www.noe-room.com/specials/${eventId}` }
        ]}
      >
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <ErrorDisplay
            error={error.message}
            context="企画詳細の取得"
            size="md"
          />
        </div>
      </PageLayout>
    );
  }

  if (!eventDetail) {
    return (
      <PageLayout
        title="企画"
        description={<p>イベントが見つかりません</p>}
        breadcrumbItems={[
          { name: 'ホーム', url: 'https://www.noe-room.com/' },
          { name: 'スペシャル', url: 'https://www.noe-room.com/specials' },
          { name: '詳細', url: `https://www.noe-room.com/specials/${eventId}` }
        ]}
      >
        <div className="flex items-center justify-center h-64 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="text-center">
            <div className="text-text-secondary text-lg font-medium mb-2">イベントが見つかりませんでした</div>
            <div className="text-text-muted text-sm">指定されたイベントは存在しません</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={eventDetail.event.title}
      description={
        <p>{eventDetail.event.description}</p>
      }
      breadcrumbItems={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'スペシャル', url: 'https://www.noe-room.com/specials' },
        {
          name: eventDetail.event.title,
          url: `https://www.noe-room.com/specials/${eventId}`
        }
      ]}
    >
      <SpecialEventDetail
        eventDetail={eventDetail}
        onBack={handleBack}
      />
    </PageLayout>
  );
}
