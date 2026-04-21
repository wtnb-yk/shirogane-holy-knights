import { getStreams } from '@/lib/data/streams';
import { getSongs } from '@/lib/data/music';
import { getAsmrStreams } from '@/lib/data/asmr';

export type NavItem = {
  readonly name: string;
  readonly desc: string;
  readonly href: string;
};

export type NavGroup = {
  readonly label: string;
  readonly items: readonly NavItem[];
};

export function getNavGroups(): readonly NavGroup[] {
  const streamCount = getStreams().length.toLocaleString();
  const songCount = getSongs().length.toLocaleString();
  const asmrCount = getAsmrStreams().length.toLocaleString();

  return [
    {
      label: '探す',
      items: [
        {
          name: '配信',
          desc: `${streamCount}件の配信を検索・チェックで記録`,
          href: '/streams',
        },
        {
          name: '楽曲',
          desc: `${songCount}曲のレパートリー・歌枠検索`,
          href: '/music',
        },
        {
          name: '今日のASMR',
          desc: `気分に合わせたASMRを提案`,
          href: '/asmr',
        },
      ],
    },
    {
      label: '共有する',
      items: [
        {
          name: '団員レポート',
          desc: '推し活データをレポート画像に',
          href: '/report',
        },
        {
          name: '団員のあしあと',
          desc: '視聴履歴のヒートマップ',
          href: '/footprint',
        },
      ],
    },
  ];
}
