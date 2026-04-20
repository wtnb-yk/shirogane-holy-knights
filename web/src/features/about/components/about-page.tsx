import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="py-xl border-t border-border">
        <p className="font-mono text-3xs font-medium tracking-wider uppercase text-accent-label mb-md">
          {label}
        </p>
        <h2 className="font-display text-base md:text-lg font-semibold text-heading mb-sm">
          {title}
        </h2>
        {children}
      </div>
    </Reveal>
  );
}

function ListItem({ children }: { children: ReactNode }) {
  return (
    <li className="pl-md relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-sm before:h-px before:bg-accent">
      {children}
    </li>
  );
}

export function AboutPage() {
  return (
    <div className="max-w-[var(--prose-max)] mx-auto px-md md:px-lg pb-3xl">
      {/* ---- ヘッダー ---- */}
      <div
        className="py-xl md:py-2xl"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, var(--glow-gold) 0%, transparent 100%)',
        }}
      >
        <SectionHeader
          label="About"
          title="このサイトについて"
          description={
            <>
              白銀ノエルファン（団員）のための
              <br />
              非公式推し活記録アプリです。
            </>
          }
        />
        <p className="font-mono text-3xs text-subtle tracking-wide mt-lg md:mt-xl uppercase text-center">
          Unofficial Fan Site
        </p>
      </div>

      {/* ---- セクション ---- */}
      <Section label="What is this" title="だんいんログとは">
        <p className="text-sm text-secondary leading-relaxed-plus">
          白銀ノエルさんの配信・楽曲・ASMRを探したり、自分の視聴記録を残したりできるファンメイドのWebアプリです。
        </p>
        <ul className="mt-sm space-y-xs text-sm text-secondary leading-relaxed-plus">
          <ListItem>配信アーカイブの検索・フィルタリング</ListItem>
          <ListItem>楽曲レパートリー・セットリスト検索</ListItem>
          <ListItem>気分に合わせたASMRおすすめ</ListItem>
          <ListItem>視聴履歴のヒートマップ・レポート作成</ListItem>
        </ul>
      </Section>

      <Section label="Your Data" title="データの取り扱い">
        <p className="text-sm text-secondary leading-relaxed-plus">
          ユーザー登録・ログインは不要です。視聴チェックなどの記録はすべてお使いのブラウザ（localStorage）に保存され、外部サーバーへ送信されることはありません。
        </p>
        <p className="text-xs text-muted mt-xs">
          ※
          ブラウザのデータを消去すると記録も失われます。端末やブラウザ間での同期はできません。
        </p>
      </Section>

      <Section label="Legal" title="権利表記">
        <ul className="space-y-xs text-sm text-secondary leading-relaxed-plus">
          <ListItem>
            本サイトは非公式のファンサイトです。白銀ノエルさん、ホロライブプロダクション、カバー株式会社とは一切関係ありません。
          </ListItem>
          <ListItem>
            白銀ノエルさん及びホロライブプロダクションに関するすべての権利は、各権利者に帰属します。
          </ListItem>
          <ListItem>
            本サイトはカバー株式会社の
            <a
              href="https://hololivepro.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive hover:text-link-hover underline underline-offset-2"
            >
              二次創作ガイドライン
            </a>
            に基づいて運営しています。
          </ListItem>
        </ul>
      </Section>

      <Section label="Contact" title="お問い合わせ">
        <p className="text-sm text-secondary leading-relaxed-plus">
          ご意見・ご要望・権利に関するお問い合わせは、下記までご連絡ください。
        </p>
        <p className="font-mono text-xs text-subtle mt-sm">
          X (Twitter) &mdash;{' '}
          <a
            href="https://x.com/ChuunChuuun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-interactive hover:text-link-hover underline underline-offset-2"
          >
            @ChuunChuuun
          </a>
        </p>
      </Section>
    </div>
  );
}
