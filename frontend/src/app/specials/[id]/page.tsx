'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SpecialEventDetail } from '@/features/specials/components/details/SpecialEventDetail';
import { useSpecialEventDetail } from '@/features/specials/hooks/useSpecialEventDetail';

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

  return (
    <PageLayout
      title={eventDetail?.event.title || 'SPECIALS'}
      description={
        eventDetail?.event.description ? (
          <p>{eventDetail.event.description}</p>
        ) : undefined
      }
      breadcrumbItems={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'スペシャル', url: 'https://www.noe-room.com/specials' },
        {
          name: eventDetail?.event.title || '詳細',
          url: `https://www.noe-room.com/specials/${eventId}`
        }
      ]}
    >
      <SpecialEventDetail
        eventDetail={eventDetail}
        loading={loading}
        error={error}
        onBack={handleBack}
      />
    </PageLayout>
  );
}
