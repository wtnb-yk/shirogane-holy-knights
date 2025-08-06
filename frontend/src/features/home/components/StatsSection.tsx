'use client';

import React from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';

export default function StatsSection() {
  const { totalCount, loading } = useVideos({ pageSize: 1 });

  const stats = [
    {
      id: 1,
      label: "総配信数",
      value: loading ? "---" : totalCount?.toLocaleString() || "0",
      icon: "🎥"
    },
    {
      id: 2,
      label: "デビューからの日数",
      value: Math.floor((new Date().getTime() - new Date('2019-08-08').getTime()) / (1000 * 60 * 60 * 24)).toLocaleString(),
      icon: "📅"
    },
    {
      id: 3,
      label: "団員の愛",
      value: "∞",
      icon: "💝"
    },
    {
      id: 4,
      label: "歌の魅力度",
      value: "★★★★★",
      icon: "🎵"
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
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            活動の軌跡
          </h2>
          <div className="w-20 h-1 bg-sage-300 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            デビューから現在まで、白銀ノエル団長の配信活動を数字で振り返ります
          </p>
        </div>

        {/* 統計数値 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-sage-200 p-6 text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-4xl mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-sage-300 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 活動の種類 */}
        <div className="bg-sage-100/20 rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800">
              主な活動内容
            </h3>
          </div>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-white border border-sage-200"
              >
                <div className="text-3xl mb-3">
                  {achievement.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* メッセージ */}
        <div className="text-center">
          <div className="bg-white rounded-lg border border-sage-200 p-6 max-w-lg mx-auto">
            <p className="text-gray-700 font-medium">
              これからも末永く応援をお願いします！
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}