'use client';

import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function AboutPage() {
  return (
    <PageLayout
      title="ABOUT"
      description={
        <p></p>
      }
    >
      <BreadcrumbSchema items={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'アバウト', url: 'https://www.noe-room.com/about' }
      ]} />
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
              白銀ノエルさんの配信、歌、関連ニュースなどの情報を整理し、
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

        {/* プライバシーポリシー */}
        <section>
          <h2 className="text-xl font-bold text-surface-primary mb-6 pb-2 border-b border-surface-border">
            プライバシーポリシー
          </h2>
          <div className="space-y-4 text-surface-primary/80">
            <h3 className="font-semibold">アクセス解析ツールについて</h3>
            <p>
              当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。
              このGoogleアナリティクスはデータの収集のためにCookieを使用しています。
              このデータは匿名で収集されており、個人を特定するものではありません。
            </p>
            <p>
              この機能はCookieを無効にすることで収集を拒否することが出来ますので、
              お使いのブラウザの設定をご確認ください。
            </p>
            <p>
              この規約に関しての詳細は
              <a 
                href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-primary/80 transition-colors mx-1"
              >
                Googleアナリティクスサービス利用規約
              </a>
              のページや
              <a 
                href="https://policies.google.com/privacy?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-primary/80 transition-colors mx-1"
              >
                Googleポリシーと規約
              </a>
              ページをご覧ください。
            </p>
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
