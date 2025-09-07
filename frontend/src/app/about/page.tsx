'use client';

import { PageLayout } from '@/components/common/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout
      title="ABOUT"
      description={
        <p></p>
      }
    >
      <div className="max-w-4xl mx-auto space-y-10">
        {/* サイト概要 */}
        <section>
          <h2 className="text-xl font-bold text-surface-primary mb-6 pb-2 border-b border-surface-border">
            サイト概要
          </h2>
          <div className="space-y-4 text-surface-primary/80">
            <p>
              「だんいんポータル」は、ホロライブプロダクション所属VTuber 白銀ノエルさんを応援する非公式ファンサイトです。
            </p>
            <p>
              白銀ノエルさんの配信、ライブ動画、関連ニュースなどの情報を整理し、
              ファンの皆様がより楽しく白銀ノエルさんを応援できるようサポートすることを目的としています。
            </p>
          </div>
        </section>

        {/* 免責事項 */}
        <section>
          <h2 className="text-xl font-bold text-surface-primary mb-6 pb-2 border-b border-surface-border">
            免責事項
          </h2>
          <div className="space-y-4 text-surface-primary/80">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                当サイトは非公式のファンサイトであり、カバー株式会社様、ホロライブプロダクション様とは一切関係ありません。
              </li>
              <li>
                当サイトで使用している画像・動画等の著作権・肖像権等は各権利者に帰属いたします。
              </li>
              <li>
                権利者様からの削除依頼等がございましたら、速やかに対応いたします。
              </li>
              <li>
                当サイトは、ホロライブプロダクションの
                <a 
                  href="https://hololivepro.com/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-primary/80 transition-colors ml-1"
                >
                  二次創作ガイドライン
                </a>
                に従って運営しております。
              </li>
            </ul>
          </div>
        </section>

        {/* 運営 */}
        <section>
          <h2 className="text-xl font-bold text-surface-primary mb-6 pb-2 border-b border-surface-border">
            運営
          </h2>
          <div className="space-y-4 text-surface-primary/80">
            <div className="flex items-center gap-2">
              <span>運営者:</span>
              <a 
                href="https://x.com/ChuunChuuun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-primary/80 transition-colors"
              >
                @ChuunChuuun
              </a>
            </div>
            <p className="text-sm">
              お問い合わせは上記Xアカウントまでお願いいたします。
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
