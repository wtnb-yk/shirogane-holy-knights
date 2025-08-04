'use client';

import React from 'react';
import { DecorativeFrame } from '@/components/ui/decorations/DecorativeFrame';
import { DecorativeRibbon } from '@/components/ui/decorations/DecorativeRibbon';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SectionDivider } from '@/components/ui/decorations/SectionDivider';
import { useVideos } from '@/features/videos/hooks/useVideos';

export default function StatsSection() {
  const { totalCount, loading } = useVideos({ pageSize: 1 });

  const stats = [
    {
      id: 1,
      label: "総配信数",
      value: loading ? "---" : totalCount?.toLocaleString() || "0",
      icon: "🎥",
      color: "text-noel-primary",
      bgColor: "from-noel-primary/20 to-noel-primary/5"
    },
    {
      id: 2,
      label: "デビューからの日数",
      value: Math.floor((new Date().getTime() - new Date('2019-08-08').getTime()) / (1000 * 60 * 60 * 24)).toLocaleString(),
      icon: "📅",
      color: "text-noel-secondary",
      bgColor: "from-noel-secondary/20 to-noel-secondary/5"
    },
    {
      id: 3,
      label: "団員の愛",
      value: "∞",
      icon: "💝",
      color: "text-pink-500",
      bgColor: "from-pink-100 to-pink-50"
    },
    {
      id: 4,
      label: "歌の魅力度",
      value: "★★★★★",
      icon: "🎵",
      color: "text-yellow-500",
      bgColor: "from-yellow-100 to-yellow-50"
    }
  ];

  const achievements = [
    {
      title: "歌ってみた動画",
      description: "数多くの楽曲をカバーし、美しい歌声で団員を魅了",
      icon: "🎤"
    },
    {
      title: "ゲーム配信",
      description: "様々なジャンルのゲームを楽しく実況プレイ",
      icon: "🎮"
    },
    {
      title: "雑談配信",
      description: "団員との温かい交流を大切にした配信スタイル",
      icon: "💭"
    },
    {
      title: "コラボ配信",
      description: "他のメンバーとの楽しいコラボレーション",
      icon: "👥"
    }
  ];

  return (
    <>
      <SectionDivider variant="zigzag" />
      <section className="py-20 bg-noel-bg-light relative overflow-hidden">
        {/* 背景パターン - デスクトップのみ */}
        <div className="absolute inset-0 opacity-5 hidden lg:block">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 32 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center">
                <KnightEmblem size="sm" variant="simple" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="animate-section-enter">
            <DecorativeRibbon variant="banner" className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-noel-text-primary">
                活動の軌跡
              </h2>
            </DecorativeRibbon>
            
            <p className="text-center text-lg text-noel-text-secondary mb-12 max-w-3xl mx-auto">
              デビューから現在まで、白銀ノエル団長の配信活動を数字で振り返ります
            </p>

            {/* 統計数値 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <DecorativeFrame variant="simple" className="h-full">
                    <div className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full`}>
                      <div className="text-4xl mb-3">
                        {stat.icon}
                      </div>
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-noel-text-secondary font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </DecorativeFrame>
                </div>
              ))}
            </div>

            {/* 活動の種類 */}
            <DecorativeFrame variant="elegant" className="bg-white rounded-xl shadow-xl mb-12">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <KnightEmblem size="md" variant="crest" />
                  <h3 className="text-2xl font-bold text-noel-text-primary">
                    主な活動内容
                  </h3>
                  <KnightEmblem size="md" variant="shield" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-lg bg-noel-bg-light/50 hover:bg-noel-bg-light transition-colors duration-300"
                      style={{ 
                        animationDelay: `${(index + 4) * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="text-3xl mb-3">
                        {achievement.icon}
                      </div>
                      <h4 className="font-bold text-noel-text-primary mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-noel-text-secondary">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DecorativeFrame>

            {/* メッセージ */}
            <div className="text-center">
              <DecorativeRibbon variant="scroll" className="bg-gradient-to-r from-noel-primary/10 to-noel-secondary/10">
                <p className="text-noel-primary font-bold text-lg">
                  これからも末永く応援をお願いします！
                </p>
              </DecorativeRibbon>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="zigzag" flip />
    </>
  );
}
