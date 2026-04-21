import Link from 'next/link';
import { HeroReportPreview } from './hero-report-preview';

type Props = {
  streamCount: number;
  songCount: number;
  asmrCount: number;
  thumbnails: string[];
};

export function Hero({ streamCount, songCount, asmrCount, thumbnails }: Props) {
  // サムネイルを3列に分配（ループ用に2倍）
  const row1 = thumbnails.slice(0, 12);
  const row2 = thumbnails.slice(4, 16);
  const row3 = thumbnails.slice(8, 20);

  return (
    <section className="relative overflow-hidden bg-page">
      {/* 背景: サムネイルが横に流れる */}
      <div className="absolute inset-0 flex flex-col justify-center gap-sm opacity-12 pointer-events-none">
        <ThumbRow
          thumbnails={row1}
          className="animate-feed-slide"
          style={{ animationDuration: '40s' }}
        />
        <ThumbRow
          thumbnails={row2}
          className="animate-feed-slide"
          style={{ animationDuration: '50s', animationDirection: 'reverse' }}
        />
        <ThumbRow
          thumbnails={row3}
          className="animate-feed-slide"
          style={{ animationDuration: '45s' }}
        />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-[var(--content-max)] mx-auto px-md md:px-lg py-xl md:py-2xl grid grid-cols-1 md:grid-cols-[1fr_320px] gap-xl md:gap-2xl items-center">
        {/* 左: テキスト + CTA */}
        <div>
          <div className="text-sm text-accent mb-md">&#9876;</div>
          <h1 className="font-body text-4xl font-bold text-heading leading-[1.1] tracking-tight mb-xs">
            だんいんログ
          </h1>
          <p className="text-lg text-secondary mb-lg">
            団員の推し活を、もっと楽しく。
          </p>
          <p className="text-sm text-muted leading-relaxed mb-xl max-w-[440px]">
            白銀ノエルの{streamCount.toLocaleString()}件の配信・
            {songCount.toLocaleString()}曲の楽曲・{asmrCount}本のASMRを探索。
            <br />
            視聴記録をつけて、あなただけのレポートを作ろう。
          </p>
          <div className="flex gap-sm items-center flex-wrap">
            <Link
              href="/streams"
              className="inline-flex items-center gap-sm px-xl py-3 bg-heading text-surface font-body text-sm font-bold rounded-sm transition-all duration-200 ease-out-expo hover:-translate-y-px hover:shadow-button-hover"
            >
              配信を見る
            </Link>
            <Link
              href="/music"
              className="inline-flex items-center gap-sm px-lg py-3 bg-surface text-interactive border border-border-hover font-body text-sm font-semibold rounded-sm transition-all duration-200 ease-out-expo hover:border-border-strong hover:text-heading hover:bg-[var(--glow-navy)]"
            >
              &#9834; 楽曲を探す
            </Link>
            <Link
              href="/asmr"
              className="inline-flex items-center gap-sm px-lg py-3 bg-surface text-interactive border border-border-hover font-body text-sm font-semibold rounded-sm transition-all duration-200 ease-out-expo hover:border-border-strong hover:text-heading hover:bg-[var(--glow-navy)]"
            >
              &#9790; 今日のASMR
            </Link>
          </div>
          <p className="font-mono text-3xs text-subtle mt-md tracking-normal">
            ログイン不要 &middot; ブラウザに保存 &middot; 完全無料
          </p>
        </div>

        {/* 右: レポートカードプレビュー */}
        <HeroReportPreview />
      </div>
    </section>
  );
}

function ThumbRow({
  thumbnails,
  className,
  style,
}: {
  thumbnails: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  // ループ用に2倍に
  const doubled = [...thumbnails, ...thumbnails];

  return (
    <div className={`flex gap-sm w-max ${className ?? ''}`} style={style}>
      {doubled.map((url, i) => (
        <div
          key={i}
          className="w-[180px] aspect-video flex-shrink-0 rounded-sm overflow-hidden bg-surface-hover"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 背景装飾用サムネイル */}
          <img
            src={url}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
