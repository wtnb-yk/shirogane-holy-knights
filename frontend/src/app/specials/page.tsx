'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSpecials } from '@/features/specials/hooks/useSpecials';
import { SpecialsGrid } from '@/features/specials/components/grids/SpecialsGrid';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SpecialEventDto } from '@/features/specials/types/types';

/**
 * スペシャルイベントメインページコンポーネント
 */
export default function SpecialsPage() {
  const router = useRouter();
  const {
    events,
    loading,
    error
  } = useSpecials();

  const handleEventClick = (event: SpecialEventDto) => {
    router.push(`/specials/${event.id}`);
  };

  return (
    <PageLayout
      title="SPECIALS"
      description={
        <p>
          当サイトで実施している企画を紹介しています。<br />
          企画は周年や生誕祭などの記念日に合わせて随時開催予定です！
        </p>
      }
      breadcrumbItems={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'スペシャル', url: 'https://www.noe-room.com/specials' }
      ]}
    >
      <SpecialsGrid
        events={events}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
      />
    </PageLayout>
  );
}
