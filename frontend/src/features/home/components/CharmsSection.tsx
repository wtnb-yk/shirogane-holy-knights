import React from 'react';

export default function CharmsSection() {
  const charms = [
    {
      id: 1,
      title: "美しい歌声",
      description: "透明感のある歌声で多くの団員を魅了。アニソンからバラードまで幅広いジャンルを歌いこなします。",
      icon: "🎵"
    },
    {
      id: 2,
      title: "優しい人柄",
      description: "団員思いで温かい性格。配信では常に視聴者のことを考えた心遣いを見せてくれます。",
      icon: "💖"
    },
    {
      id: 3,
      title: "ゲームスキル",
      description: "様々なゲームを楽しくプレイ。上手い時も失敗した時も、その反応が愛らしくて見ていて飽きません。",
      icon: "🎮"
    },
    {
      id: 4,
      title: "騎士団団長",
      description: "白銀聖騎士団の頼れる団長として、メンバーをまとめる責任感と包容力を持っています。",
      icon: "⚔️"
    },
    {
      id: 5,
      title: "天然な一面",
      description: "時々見せる天然な発言や行動が、ファンの心をぎゅっと掴んで離しません。",
      icon: "✨"
    },
    {
      id: 6,
      title: "努力家",
      description: "歌やゲーム、配信の質向上のために常に努力を惜しまない姿勢が多くの人に感動を与えています。",
      icon: "🌟"
    }
  ];

  return (
    <section className="py-16 bg-bg-accent/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            白銀ノエルの魅力
          </h2>
          <div className="w-20 h-1 bg-text-secondary mx-auto rounded-full mb-4"></div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            多くの団員に愛される白銀ノエル団長の魅力をご紹介します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charms.map((charm) => (
            <div
              key={charm.id}
              className="bg-bg-primary rounded-lg p-6 border border-surface-border hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-3">
                  {charm.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {charm.title}
                </h3>
              </div>
              
              <p className="text-text-secondary text-sm leading-relaxed">
                {charm.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-bg-primary rounded-lg border border-surface-border p-6 max-w-lg mx-auto">
            <p className="text-text-primary font-medium">
              これからも白銀ノエル団長を応援していきましょう！
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}