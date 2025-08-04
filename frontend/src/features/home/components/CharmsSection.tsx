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
      <section className="py-20 bg-white relative overflow-hidden">
        {/* 背景装飾 - デスクトップのみ */}
        <div className="absolute top-20 left-5 opacity-5 hidden lg:block">
          <KnightEmblem size="xl" variant="crest" />
        </div>
        <div className="absolute bottom-20 right-5 opacity-5 hidden lg:block">
          <KnightEmblem size="lg" variant="shield" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="animate-section-enter">
            <DecorativeRibbon variant="banner" className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-noel-text-primary">
                白銀ノエルの魅力
              </h2>
            </DecorativeRibbon>
            
            <p className="text-center text-lg text-noel-text-secondary mb-12 max-w-3xl mx-auto">
              多くの団員に愛される白銀ノエル団長の魅力をご紹介します
            </p>

            {/* 魅力ポイント一覧 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {charms.map((charm, index) => (
                <div
                  key={charm.id}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <DecorativeFrame variant="simple" className="h-full">
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-3">
                          {charm.icon}
                        </div>
                        <h3 className={`text-xl font-bold ${charm.color} mb-2`}>
                          {charm.title}
                        </h3>
                      </div>
                      
                      <p className="text-noel-text-secondary text-sm leading-relaxed">
                        {charm.description}
                      </p>
                      
                      {/* 装飾的なボーダー */}
                      <div className="mt-4 flex justify-center">
                        <div className="w-12 h-1 bg-gradient-to-r from-noel-primary to-noel-secondary rounded-full opacity-30"></div>
                      </div>
                    </div>
                  </DecorativeFrame>
                </div>
              ))}
            </div>

            {/* セクション下部の装飾 */}
            <div className="mt-16 text-center">
              <DecorativeRibbon variant="scroll" className="bg-noel-bg-light/50">
                <p className="text-noel-primary font-semibold">
                  これからも白銀ノエル団長を応援していきましょう！
                </p>
              </DecorativeRibbon>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="ornate" flip />
    </>
  );
}
