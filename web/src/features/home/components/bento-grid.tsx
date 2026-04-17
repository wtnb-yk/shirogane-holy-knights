import Link from 'next/link';
import { getStreams } from '@/lib/data/streams';
import { getSongs } from '@/lib/data/music';
import { getAsmrStreams } from '@/lib/data/asmr';

type CardData = {
  readonly name: string;
  readonly desc: string;
  readonly meta: string;
  readonly href: string;
};

function buildCards() {
  const streamCount = getStreams().length.toLocaleString();
  const songCount = getSongs().length.toLocaleString();
  const asmrCount = getAsmrStreams().length.toLocaleString();

  const explore: readonly CardData[] = [
    {
      name: '配信一覧',
      desc: `${streamCount}件の配信をタグやキーワードで検索。チェックで視聴記録をつける。`,
      meta: `${streamCount} streams`,
      href: '/streams',
    },
    {
      name: '楽曲ライブラリ',
      desc: 'レパートリー全曲の検索。曲名から歌った配信を逆引き。',
      meta: `${songCount} songs`,
      href: '/music',
    },
    {
      name: '今日のASMR',
      desc: '気分を選ぶと、今日のあなたに合うASMRを一本提案する。',
      meta: `${asmrCount} archives`,
      href: '/asmr',
    },
  ];

  const create: readonly CardData[] = [
    {
      name: '団員レポート',
      desc: 'あなたの推し活データから、レポート画像を生成。',
      meta: 'share report',
      href: '/report',
    },
    {
      name: '団員のあしあと',
      desc: '視聴履歴を年間ヒートマップ画像にして残す。',
      meta: 'share heatmap',
      href: '/footprint',
    },
  ];

  return { explore, create };
}

function HubCard({ name, desc, meta, href }: CardData) {
  return (
    <Link
      href={href}
      className="group/card relative flex flex-col gap-xs md:gap-sm bg-surface border border-border rounded-lg p-md md:p-lg max-md:min-h-0 md:min-h-[var(--hub-card-min-h)] transition-all duration-300 ease-out-expo hover:border-border-strong hover:shadow-card-hover hover:-translate-y-[3px]"
    >
      <div className="font-display text-base md:text-lg font-semibold text-heading">
        {name}
      </div>
      <div className="text-xs text-secondary leading-[1.7]">{desc}</div>
      <div className="mt-auto pt-xs font-mono text-3xs md:text-xs text-subtle">
        {meta}
      </div>
      <span className="absolute bottom-md md:bottom-lg right-md md:right-lg font-mono text-sm text-faint transition-all duration-300 ease-out-expo group-hover/card:text-link-hover group-hover/card:translate-x-1">
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
      <div className="font-mono text-3xs md:text-xs font-medium tracking-wider uppercase text-accent-label mb-sm md:mb-md">
        {label}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm md:gap-md">
        {cards.map((card) => (
          <HubCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}

export function BentoGrid() {
  const { explore, create } = buildCards();

  return (
    <section className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-xl md:pt-2xl pb-xl md:pb-3xl">
      <div className="font-mono text-3xs md:text-xs font-medium tracking-wider uppercase text-accent-label mb-xs md:mb-sm">
        03 &mdash; All Tools
      </div>
      <h2 className="font-display text-xl md:text-2xl font-semibold text-heading leading-[1.3] mb-xs">
        機能一覧
      </h2>
      <p className="text-xs md:text-sm text-muted max-w-[560px] mb-lg md:mb-xl leading-relaxed">
        配信の探索・記録から、推し活データの可視化・シェアまで。
      </p>

      <div className="flex flex-col gap-lg md:gap-xl">
        <CardGroup label="探す" cards={explore} />
        <CardGroup label="共有する" cards={create} />
      </div>
    </section>
  );
}
