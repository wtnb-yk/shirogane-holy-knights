import React from 'react';

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
    description: "ホロライブ所属のVTuberで、白銀聖騎士団の団長。明るく優しい性格で、団員（ファン）を大切にする心優しい白い獅子。歌とゲームが得意で、特に歌声は多くの人を魅了している。"
  };

  return (
    <section id="profile" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Profile
          </h2>
          <div className="w-20 h-1 bg-sage-300 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 画像エリア */}
          <div>
            <div className="bg-sage-100/30 rounded-xl p-4">
              <div className="w-full h-96 bg-gradient-to-br from-sage-100/30 via-white to-sage-200/20 rounded-lg border-2 border-dashed border-sage-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👑</div>
                  <p className="text-sage-300 font-bold text-sm">ノエル様ポートレート</p>
                  <p className="text-xs text-sage-200">画像は後日追加予定</p>
                </div>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-sage-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                基本情報
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: '名前', value: profileData.name },
                  { label: 'デビュー', value: profileData.debut },
                  { label: '誕生日', value: profileData.birthday },
                  { label: 'ファンネーム', value: profileData.fanName },
                  { label: '所属', value: profileData.generation }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sage-100/30 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                {profileData.description}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sage-300 font-medium text-lg">
                「{profileData.catchphrase}」
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}