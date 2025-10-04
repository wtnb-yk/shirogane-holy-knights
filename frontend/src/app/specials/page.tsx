'use client';

import React, { useMemo } from 'react';
import { useSpecials } from '@/features/specials/hooks/useSpecials';
import { SpecialsGrid } from '@/features/specials/components/grids/SpecialsGrid';
import { PageLayout } from '@/components/Layout/PageLayout';
import { CountdownTimer } from '@/components/Timer';
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

  // 次の開催予定イベントを取得
  const nextUpcomingEvent = useMemo(() => {
    const upcomingEvents = events
      .filter(event => event.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return upcomingEvents[0] || null;
  }, [events]);

  const handleEventClick = (event: SpecialEventDto) => {
    console.log('Event clicked:', event);
  };

  const handleNextEventExpired = () => {
    console.log('Next event has started!');
    // ここで必要に応じてデータを再取得
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
      {/* 次回開催予定イベントのハイライト */}
      {nextUpcomingEvent && !loading && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200/20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              次回開催予定
            </h2>
            <h3 className="text-xl font-semibold text-text-secondary">
              {nextUpcomingEvent.title}
            </h3>
            <p className="text-text-muted max-w-2xl mx-auto">
              {nextUpcomingEvent.description}
            </p>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-text-muted">開始まで</span>
              <CountdownTimer
                targetDate={nextUpcomingEvent.startDate}
                onExpired={handleNextEventExpired}
              />
            </div>
            <div className="text-sm text-text-tertiary">
              開始予定: {new Date(nextUpcomingEvent.startDate).toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
      )}

      <SpecialsGrid
        events={events}
        loading={loading}
        error={error}
        onEventClick={handleEventClick}
      />
    </PageLayout>
  );
}
