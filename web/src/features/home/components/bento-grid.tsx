import Link from 'next/link';

type CardData = {
  readonly name: string;
  readonly desc: string;
  readonly meta: string;
  readonly href: string;
};

const EXPLORE_CARDS: readonly CardData[] = [
  {
    name: '団員の視聴ログ',
    desc: '1,419件の配信をタグで絞り込み、視聴チェックで記録する。',
    meta: '1,419 streams',
    href: '/streams',
  },
  {
    name: '楽曲ライブラリ',
    desc: 'レパートリー全曲の検索。曲名から歌った配信を逆引き。',
    meta: '452 songs',
    href: '/music',
  },
  {
    name: '今日のASMR',
    desc: '気分を選ぶと、今日のあなたに合うASMRを一本提案する。',
    meta: '63 archives',
    href: '/asmr',
  },
];

const CREATE_CARDS: readonly CardData[] = [
  {
    name: '団員レポート',
    desc: 'あなたの推し活データから、レポート画像を生成。',
    meta: 'share image',
    href: '/report',
  },
  {
    name: '団員のあしあと',
    desc: '視聴履歴を年間ヒートマップ画像にして残す。',
    meta: 'share image',
    href: '/footprint',
  },
];

function HubCard({ name, desc, meta, href }: CardData) {
  return (
    <Link
      href={href}
      className="group/card relative flex flex-col gap-sm bg-surface border border-border rounded-lg p-lg min-h-[var(--hub-card-min-h)] transition-all duration-300 ease-out-expo hover:border-border-strong hover:shadow-card-hover hover:-translate-y-[3px]"
    >
      <div className="font-display text-lg font-semibold text-heading">
        {name}
      </div>
      <div className="text-xs text-secondary leading-[1.7]">{desc}</div>
      <div className="mt-auto font-mono text-xs text-subtle">{meta}</div>
      <span className="absolute bottom-lg right-lg font-mono text-sm text-faint transition-all duration-300 ease-out-expo group-hover/card:text-link-hover group-hover/card:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}

function CardGroup({
  label,
  cards,
}: {
  label: string;
  cards: readonly CardData[];
}) {
  return (
    <div>
      <div className="font-mono text-xs font-medium tracking-[0.14em] uppercase text-accent-label mb-md">
        {label}
      </div>
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-md">
        {cards.map((card) => (
          <HubCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <section className="max-w-[var(--content-max)] mx-auto px-lg pt-2xl pb-3xl">
      <div className="font-mono text-xs font-medium tracking-[0.14em] uppercase text-accent-label mb-sm">
        03 &mdash; All Tools
      </div>
      <h2 className="font-display text-2xl font-semibold text-heading leading-[1.3] mb-xs">
        機能一覧
      </h2>
      <p className="text-sm text-muted max-w-[560px] mb-xl leading-relaxed">
        配信の探索・記録から、推し活データの可視化・シェアまで。
      </p>

      <div className="flex flex-col gap-xl">
        <CardGroup label="探す" cards={EXPLORE_CARDS} />
        <CardGroup label="作る" cards={CREATE_CARDS} />
      </div>
    </section>
  );
}
