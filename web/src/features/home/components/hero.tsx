type Props = {
  thumbnails: string[];
};

export function Hero({ thumbnails }: Props) {
  // サムネイルを3列に均等分配（重複なし）
  const row1 = thumbnails.slice(0, 12);
  const row2 = thumbnails.slice(12, 24);
  const row3 = thumbnails.slice(24, 36);

  return (
    <section className="relative overflow-hidden bg-page">
      {/* 背景: サムネイルが横に流れる（ヘッダーとの間に余白を確保） */}
      <div className="absolute left-0 right-0 bottom-0 top-md flex flex-col justify-center gap-sm opacity-12 pointer-events-none">
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
      <div className="relative z-10 max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-md pb-md min-h-[var(--hero-min-h)] md:min-h-[var(--hero-min-h-md)] flex items-center">
        <div>
          <h1 className="font-body text-2xl md:text-4xl font-bold text-heading leading-[1.1] tracking-tight mb-xs">
            だんいんログ
          </h1>
          <p className="text-sm md:text-lg text-secondary mb-md">
            団員の推し活を、もっと楽しく。
          </p>
          <p className="text-xs md:text-sm text-muted leading-relaxed mb-md max-w-[var(--hero-desc-max)]">
            白銀ノエル団長のコンテンツを探して、観て、記録する。
            <br />
            あなたの推し活が、ここに積み重なっていく。
          </p>
        </div>
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
          className="w-[var(--thumb-flow-w)] md:w-[var(--thumb-flow-w-md)] aspect-video shrink-0 rounded-sm overflow-hidden bg-surface-hover"
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
