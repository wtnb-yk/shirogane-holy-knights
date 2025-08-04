import React from 'react';
import { DecorativeFrame } from '@/components/ui/decorations/DecorativeFrame';
import { DecorativeRibbon } from '@/components/ui/decorations/DecorativeRibbon';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SectionDivider } from '@/components/ui/decorations/SectionDivider';
import { SwordDecoration } from '@/components/ui/decorations/SwordDecoration';
import { ShieldDecoration } from '@/components/ui/decorations/ShieldDecoration';
import { CowPatternDecoration } from '@/components/ui/decorations/CowPatternDecoration';
import { CowBellDecoration } from '@/components/ui/decorations/CowBellDecoration';
import { HoofDecoration } from '@/components/ui/decorations/HoofDecoration';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { FloatingParticles } from '@/components/ui/decorations/FloatingParticles';

export default function ProfileSection() {
  const profileData = {
    name: "白銀ノエル",
    nameEn: "Shirogane Noel",
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
      <section id="profile" className="py-20 bg-gradient-to-br from-blue-50/40 via-white to-sage-100/40 relative overflow-hidden">
        
        {/* 控えめな背景装飾 */}
        <FloatingParticles count={6} variant="stars" className="text-blue-200/30" />
        <FloatingParticles count={4} variant="sparkles" className="text-sage-300/25" />
        
        {/* さりげない角装飾 */}
        <div className="absolute top-16 left-16 opacity-10 hidden xl:block">
          <SwordDecoration size="lg" variant="classic" />
        </div>
        <div className="absolute top-16 right-16 opacity-10 hidden xl:block">
          <ShieldDecoration size="lg" variant="knight" />
        </div>
        <div className="absolute bottom-16 left-20 opacity-8 hidden lg:block">
          <CowBellDecoration size="md" variant="single" />
        </div>
        <div className="absolute bottom-16 right-20 opacity-8 hidden lg:block">
          <HoofDecoration size="md" variant="single" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="animate-section-enter">
            {/* エレガントなタイトル */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Profile
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sage-300 to-blue-400 mx-auto rounded-full"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 美しい画像エリア */}
            <div className="order-2 md:order-1">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-sage-200">
                {/* さりげない装飾 */}
                <div className="absolute top-4 right-4 opacity-20">
                  <KnightEmblem size="sm" variant="simple" />
                </div>
                
                <ImagePlaceholder 
                  variant="noel-portrait" 
                  size="lg" 
                  message="白銀ノエル様の画像"
                  showDecorations={false}
                />
                
                <div className="absolute bottom-4 left-4 opacity-20">
                  <KnightEmblem size="sm" variant="simple" />
                </div>
              </div>
            </div>

            {/* エレガントなプロフィール情報 */}
            <div className="order-1 md:order-2 space-y-6">
              {/* 基本情報カード */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 relative">
                <div className="absolute top-4 left-4 opacity-15">
                  <SwordDecoration size="sm" variant="classic" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  基本情報
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-sage-300 to-blue-300"></div>
                </h3>
                
                <div className="space-y-3">
                  {[
                    { label: '名前', value: profileData.name },
                    { label: '英語表記', value: profileData.nameEn },
                    { label: 'デビュー', value: profileData.debut },
                    { label: '誕生日', value: profileData.birthday },
                    { label: '身長', value: profileData.height },
                    { label: 'ファンネーム', value: profileData.fanName },
                    { label: 'ハッシュタグ', value: profileData.hashtag },
                    { label: '期生', value: profileData.generation }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <span className="text-gray-600 font-medium">{item.label}:</span>
                      <span className="text-gray-800 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute bottom-4 right-4 opacity-15">
                  <ShieldDecoration size="sm" variant="knight" />
                </div>
              </div>

              {/* 紹介カード */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 relative">
                <div className="absolute top-4 left-4 opacity-15">
                  <CowBellDecoration size="sm" variant="single" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  紹介
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-sage-300"></div>
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {profileData.description}
                </p>
                
                <div className="bg-gradient-to-r from-sage-50 to-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-sage-300 font-bold text-lg">
                    「{profileData.catchphrase}」
                  </p>
                </div>
                
                <div className="absolute bottom-4 right-4 opacity-15">
                  <HoofDecoration size="sm" variant="single" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="wave" flip />
    </>
  );
}
