import React from 'react';

export default function ProfileSection() {
  const profileData = {
    name: "白銀ノエル",
    nameEn: "Shiragami Noel",
    debut: "2019年8月8日",
    birthday: "11月24日",
    height: "154cm",
    fanName: "団員",
    hashtag: "#白銀ノエル",
    generation: "ホロライブ3期生",
    catchphrase: "おかえり〜",
    description: "ホロライブ所属のVTuberで、白銀聖騎士団の団長。明るく優しい性格で、団員（ファン）を大切にする心優しい白い獅子。歌とゲームが得意で、特に歌声は多くの人を魅了している。"
  };

  return (
    <section id="profile" className="min-h-screen flex items-center bg-noel-bg-light py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-section-enter">
          <h2 className="text-5xl font-bold text-center text-noel-text-primary mb-16">
            Profile
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 画像エリア（仮） */}
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-noel-primary/20 to-noel-secondary/20 rounded-2xl aspect-square flex items-center justify-center shadow-lg">
                <div className="text-center text-noel-text-secondary">
                  <div className="text-6xl mb-4">🦁</div>
                  <p className="text-lg font-medium">白銀ノエル</p>
                  <p className="text-sm">※画像は後日追加予定</p>
                </div>
              </div>
            </div>

            {/* プロフィール情報 */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-noel-text-primary mb-6 border-b-2 border-noel-primary pb-2">
                  基本情報
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">名前:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">英語表記:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.nameEn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">デビュー:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.debut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">誕生日:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.birthday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">身長:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">ファンネーム:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.fanName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">ハッシュタグ:</span>
                    <span className="text-noel-primary font-semibold">{profileData.hashtag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-noel-text-secondary font-medium">期生:</span>
                    <span className="text-noel-text-primary font-semibold">{profileData.generation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-noel-text-primary mb-4 border-b-2 border-noel-secondary pb-2">
                  紹介
                </h3>
                <p className="text-noel-text-secondary leading-relaxed">
                  {profileData.description}
                </p>
                <div className="mt-4 p-4 bg-noel-bg-light rounded-lg">
                  <p className="text-noel-primary font-semibold text-center">
                    「{profileData.catchphrase}」
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}