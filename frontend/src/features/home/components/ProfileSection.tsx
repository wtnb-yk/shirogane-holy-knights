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
    streamContent: ["ゲーム", "英語勉強", "雑談", "ASMR", "晩酌雑談", "朗読"],
    description: "ホロライブ3期生所属のVTuber。おっとりしているが、筋力で物事を解決する「ゆるふわ脳筋女騎士」として親しまれている。明るく優しい性格で、白銀聖騎士団（ファン）を大切にする心優しい騎士。"
  };

  return (
    <section id="profile" className="py-16 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            プロフィール
          </h2>
          <div className="w-20 h-1 bg-text-secondary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 画像エリア */}
          <div>
            <div className="w-full h-[600px] flex items-center justify-center">
              <Image
                src={commonImage}
                alt="白銀ノエル プロフィール画像"
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="space-y-6">
            {/* キャッチフレーズと自己紹介を一番上に */}
            <div className="text-center">
              <p className="text-text-secondary font-bold text-2xl mb-4">
                「{profileData.catchphrase}」
              </p>
              <p className="text-text-primary text-xl font-semibold leading-relaxed">
                {profileData.selfIntroduction}
              </p>
            </div>

            {/* 説明文 */}
            <div className="bg-bg-accent/30 rounded-xl p-6">
              <p className="text-text-primary leading-relaxed">
                {profileData.description}
              </p>
            </div>

            {/* 基本情報 */}
            <div className="bg-bg-primary rounded-xl border border-surface-border p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                基本情報
              </h3>
              
              <div className="space-y-3">
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
                  <div key={index} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
                    <span className="text-text-secondary text-sm">{item.label}</span>
                    <span className="text-text-primary font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 趣味と配信内容 */}
            <div className="bg-bg-accent/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">趣味</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {profileData.hobbies.map((hobby, index) => (
                  <span key={index} className="px-3 py-1 bg-bg-primary text-text-primary text-sm rounded-full border border-surface-border">
                    {hobby}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-bold text-text-primary mb-3">配信内容</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.streamContent.map((content, index) => (
                  <span key={index} className="px-3 py-1 bg-bg-primary text-text-primary text-sm rounded-full border border-surface-border">
                    {content}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
