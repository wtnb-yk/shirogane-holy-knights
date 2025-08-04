import React from 'react';
import { DecorativeFrame } from '@/components/ui/decorations/DecorativeFrame';
import { DecorativeRibbon } from '@/components/ui/decorations/DecorativeRibbon';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SectionDivider } from '@/components/ui/decorations/SectionDivider';

export default function CharmsSection() {
  const charms = [
    {
      id: 1,
      title: "美しい歌声",
      description: "透明感のある歌声で多くの団員を魅了。アニソンからバラードまで幅広いジャンルを歌いこなします。",
      icon: "🎵",
      color: "text-pink-500"
    },
    {
      id: 2,
      title: "優しい人柄",
      description: "団員思いで温かい性格。配信では常に視聴者のことを考えた心遣いを見せてくれます。",
      icon: "💖",
      color: "text-red-400"
    },
    {
      id: 3,
      title: "ゲームスキル",
      description: "様々なゲームを楽しくプレイ。上手い時も失敗した時も、その反応が愛らしくて見ていて飽きません。",
      icon: "🎮",
      color: "text-blue-500"
    },
    {
      id: 4,
      title: "騎士団団長",
      description: "白銀聖騎士団の頼れる団長として、メンバーをまとめる責任感と包容力を持っています。",
      icon: "⚔️",
      color: "text-yellow-500"
    },
    {
      id: 5,
      title: "天然な一面",
      description: "時々見せる天然な発言や行動が、ファンの心をぎゅっと掴んで離しません。",
      icon: "✨",
      color: "text-purple-500"
    },
    {
      id: 6,
      title: "努力家",
      description: "歌やゲーム、配信の質向上のために常に努力を惜しまない姿勢が多くの人に感動を与えています。",
      icon: "🌟",
      color: "text-green-500"
    }
  ];

  return (
    <>
      <SectionDivider variant="ornate" />
      <section className="py-20 bg-gradient-to-br from-sage-50/30 via-white to-blue-50/30 relative overflow-hidden">
        {/* 控えめな背景装飾 */}
        <div className="absolute top-20 left-12 opacity-8 hidden lg:block">
          <KnightEmblem size="lg" variant="simple" />
        </div>
        <div className="absolute bottom-20 right-12 opacity-8 hidden lg:block">
          <KnightEmblem size="lg" variant="simple" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="animate-section-enter">
            {/* エレガントなタイトル */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                白銀ノエルの魅力
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sage-300 to-blue-400 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                多くの団員に愛される白銀ノエル団長の魅力をご紹介します
              </p>
            </div>

            {/* 魅力ポイント一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {charms.map((charm, index) => (
                <div
                  key={charm.id}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border border-gray-100">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">
                        {charm.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {charm.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {charm.description}
                    </p>
                    
                    {/* 美しいボーダー */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-sage-300 to-blue-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* エレガントなメッセージ */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-sage-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-sage-200">
                <p className="text-gray-700 font-semibold text-lg">
                  これからも白銀ノエル団長を応援していきましょう！
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="ornate" flip />
    </>
  );
}
