import React from 'react';
import { DecorativeFrame } from '@/components/ui/decorations/DecorativeFrame';
import { DecorativeRibbon } from '@/components/ui/decorations/DecorativeRibbon';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SectionDivider } from '@/components/ui/decorations/SectionDivider';

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
    <>
      <SectionDivider variant="wave" />
      <section id="profile" className="min-h-screen flex items-center bg-noel-bg-light py-20 relative overflow-hidden">
        {/* 背景装飾 - デスクトップのみ */}
        <div className="absolute top-10 left-10 opacity-10 hidden lg:block">
          <KnightEmblem size="xl" variant="shield" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 hidden lg:block">
          <KnightEmblem size="lg" variant="crest" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="animate-section-enter">
            <DecorativeRibbon variant="banner" className="mb-16">
              <h2 className="text-5xl font-bold text-noel-text-primary">
                Profile
              </h2>
            </DecorativeRibbon>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 画像エリア（仮） */}
            <div className="order-2 md:order-1">
              <DecorativeFrame variant="royal" className="p-4">
                <div className="bg-gradient-to-br from-noel-primary/20 to-noel-secondary/20 rounded-2xl aspect-square flex items-center justify-center shadow-xl relative overflow-hidden">
                  {/* 装飾的なオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noel-primary/10 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <KnightEmblem size="md" variant="crest" />
                  </div>
                  
                  <div className="text-center text-noel-text-secondary relative z-10">
                    <div className="text-8xl mb-4 drop-shadow-lg">🦁</div>
                    <p className="text-xl font-bold text-noel-primary">白銀ノエル</p>
                    <p className="text-sm bg-white/80 px-3 py-1 rounded-full mt-2">※画像は後日追加予定</p>
                  </div>
                </div>
              </DecorativeFrame>
            </div>

            {/* プロフィール情報 */}
            <div className="order-1 md:order-2 space-y-6">
              <DecorativeFrame variant="elegant" className="bg-white rounded-xl shadow-xl">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <KnightEmblem size="sm" variant="simple" />
                    <h3 className="text-2xl font-bold text-noel-text-primary border-b-2 border-noel-primary pb-2 flex-1">
                      基本情報
                    </h3>
                  </div>
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
              </DecorativeFrame>

              <DecorativeFrame variant="elegant" className="bg-white rounded-xl shadow-xl">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <KnightEmblem size="sm" variant="crest" />
                    <h3 className="text-2xl font-bold text-noel-text-primary border-b-2 border-noel-secondary pb-2 flex-1">
                      紹介
                    </h3>
                  </div>
                  <p className="text-noel-text-secondary leading-relaxed">
                    {profileData.description}
                  </p>
                  <DecorativeRibbon variant="scroll" className="mt-6">
                    <p className="text-noel-primary font-bold">
                      「{profileData.catchphrase}」
                    </p>
                  </DecorativeRibbon>
                </div>
              </DecorativeFrame>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" flip />
    </>
  );
}
