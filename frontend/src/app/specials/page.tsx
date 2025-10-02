'use client';

import React from 'react';
import { useSpecials } from '@/features/specials/hooks/useSpecials';
import { SpecialsGrid } from '@/features/specials/components/grids/SpecialsGrid';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SpecialEventDto } from '@/features/specials/types/types';

/**
 * スペシャルイベントメインページコンポーネント
 */
export default function SpecialsPage() {
  const {
    events,
    loading,
    error
  } = useSpecials();

  const handleEventClick = (event: SpecialEventDto) => {
    console.log('Event clicked:', event);
  };


  return (
    <PageLayout
      title="SPECIALS"
      description={
        <p>
          白銀ノエルさんの誕生日や記念日などの特別なイベントやキャンペーンを確認できます。<br />
          開催中のイベントや今後予定されているスペシャル企画をチェックしましょう。
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