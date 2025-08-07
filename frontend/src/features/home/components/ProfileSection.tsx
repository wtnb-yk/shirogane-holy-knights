import React from 'react';
import Image from 'next/image';
import commonImage from '@/assets/common.png';

export default function ProfileSection() {
  const profileData = {
    name: "白銀ノエル",
    nameEn: "Shirogane Noel",
    title: "白銀聖騎士団団長",
    debut: "2019年8月8日",
    birthday: "11月24日",
    height: "158cm",
    fanName: "白銀聖騎士団",
    hashtag: "#ノエルーム",
    fanArtHashtag: "#ノエラート",
    generation: "ホロライブ3期生",
    illustrator: "わたお",
    catchphrase: "こんまっする〜！",
    selfIntroduction: "こんまっする～！鉄の胃袋大魔神！白銀聖騎士団の団長、白銀ノエルです！",
    hobbies: ["食べること", "ゲーム", "アニメ鑑賞"],
    streamContent: ["ゲーム", "雑談", "ASMR", "歌枠"],
    description: "ホロライブ3期生所属のVTuber。おっとりしているが、筋力で物事を解決する「ゆるふわ脳筋女騎士」として親しまれている。明るく優しい性格で、白銀聖騎士団（ファン）を大切にする心優しい騎士。"
  };

  return (
    <section id="profile" className="relative min-h-screen overflow-hidden bg-bg-primary">
      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          {/* セクションタイトル - 画面中央 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              プロフィール
            </h2>
            <div className="w-20 h-1 bg-text-secondary mx-auto rounded-full mb-4"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 左側 - 画像表示エリア（キャッチフレーズと自己紹介をオーバーレイ） */}
            <div className="relative h-[70vh] lg:h-[85vh] flex items-end">
              {/* 画像を左半分に配置 */}
              <Image
                src={commonImage}
                alt="白銀ノエル プロフィール背景"
                fill
                className="object-cover object-left-top"
                priority
              />
              {/* 下半分にテキストオーバーレイ */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-10">
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4 md:py-3">
                    <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-accent-gold drop-shadow-2xl leading-tight text-center">
                      「{profileData.catchphrase}」
                    </p>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-relaxed drop-shadow-md">
                    {profileData.selfIntroduction}
                  </p>
                </div>
              </div>
            </div>

            {/* 右側 - プロフィール情報 */}
            <div className="space-y-3 bg-white/30 backdrop-blur-sm rounded-2xl p-3 lg:p-4">

              {/* 基本情報 */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl p-3 border border-white/50">
                <h3 className="text-xl font-bold text-accent-gold mb-2">基本情報</h3>
                <div className="space-y-1.5">
                  {[
                    { label: '名前', value: profileData.name },
                    { label: 'デビュー', value: profileData.debut },
                    { label: '誕生日', value: profileData.birthday },
                    { label: '身長', value: profileData.height },
                    { label: 'ファンネーム', value: profileData.fanName },
                    { label: '所属', value: profileData.generation },
                    { label: 'イラストレーター', value: profileData.illustrator },
                    { label: '配信タグ', value: profileData.hashtag },
                    { label: 'ファンアート', value: profileData.fanArtHashtag }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-white/30 last:border-0">
                      <span className="text-text-primary drop-shadow-sm text-base font-medium">{item.label}</span>
                      <span className="text-text-primary drop-shadow-sm text-base font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 趣味と配信内容 */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl p-3 border border-white/50">
                <h3 className="text-lg font-bold text-accent-gold mb-1.5">趣味</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profileData.hobbies.map((hobby, index) => (
                    <span key={index} className="px-3 py-1.5 bg-accent-gold/25 text-text-primary text-sm font-medium rounded-full border border-accent-gold/40 drop-shadow-sm">
                      {hobby}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-lg font-bold text-accent-gold mb-1.5">配信内容</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.streamContent.map((content, index) => (
                    <span key={index} className="px-3 py-1.5 bg-accent-blue/25 text-text-primary text-sm font-medium rounded-full border border-accent-blue/40 drop-shadow-sm">
                      {content}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
