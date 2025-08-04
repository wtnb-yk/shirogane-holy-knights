import React from 'react';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SectionDivider } from '@/components/ui/decorations/SectionDivider';
import { SwordDecoration } from '@/components/ui/decorations/SwordDecoration';
import { ShieldDecoration } from '@/components/ui/decorations/ShieldDecoration';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export default function ProfileSection() {
  const profileData = {
    name: "白銀ノエル",
    nameEn: "Shirogane Noel",
    title: "白銀聖騎士団団長",
    debut: "2019年8月8日",
    birthday: "11月24日",
    age: "永遠の17歳",
    height: "154cm",
    fanName: "団員",
    hashtag: "#白銀ノエル",
    generation: "ホロライブ3期生",
    catchphrase: "おかえり〜",
    personality: ["優しい", "頼りになる", "歌上手", "天然"],
    skills: ["歌唱", "ゲーム", "雑談", "料理"],
    likes: ["歌うこと", "ゲーム", "団員との交流", "お肉"],
    description: "ホロライブ所属のVTuberで、白銀聖騎士団の団長。明るく優しい性格で、団員（ファン）を大切にする心優しい白い獅子。歌とゲームが得意で、特に歌声は多くの人を魅了している。",
    quote: "団員のみんなを守るのが、私の使命だから！"
  };

  return (
    <>
      <SectionDivider variant="wave" />
      <section id="profile" className="py-16 bg-gradient-to-br from-blue-50/40 via-white to-sage-100/40 relative overflow-hidden">
        
        {/* 控えめな背景装飾 */}
        <div className="absolute top-16 left-16 opacity-12 hidden lg:block">
          <SwordDecoration size="sm" variant="classic" />
        </div>
        <div className="absolute top-16 right-16 opacity-12 hidden lg:block">
          <ShieldDecoration size="sm" variant="knight" />
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
          
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* 美しい画像エリア - メインビジュアル */}
            <div className="order-2 md:order-1 md:col-span-2">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-sage-200">
                {/* さりげない装飾 */}
                <div className="absolute top-4 right-4 opacity-15">
                  <KnightEmblem size="sm" variant="simple" />
                </div>
                
                <ImagePlaceholder 
                  variant="noel-portrait" 
                  size="2xl" 
                  message="白銀ノエル様のポートレート"
                  showDecorations={true}
                  className="w-full"
                />
                
                <div className="absolute bottom-4 left-4 opacity-15">
                  <KnightEmblem size="sm" variant="simple" />
                </div>
              </div>
            </div>

            {/* コンパクトなプロフィール情報 */}
            <div className="order-1 md:order-2 space-y-6">
              {/* コンパクトなプロフィールカード */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 relative">
                <div className="absolute top-4 right-4 opacity-12">
                  <KnightEmblem size="sm" variant="simple" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Profile
                </h3>
                
                <div className="space-y-3">
                  {[
                    { label: '名前', value: profileData.name },
                    { label: 'デビュー', value: profileData.debut },
                    { label: '誕生日', value: profileData.birthday },
                    { label: 'ファンネーム', value: profileData.fanName }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">{item.label}</span>
                      <span className="text-gray-800 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-sage-50 to-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-sage-300 font-bold">
                    「{profileData.catchphrase}」
                  </p>
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
