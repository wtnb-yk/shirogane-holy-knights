export type NavItem = {
  readonly name: string;
  readonly desc: string;
  readonly href: string;
};

export type NavGroup = {
  readonly label: string;
  readonly items: readonly NavItem[];
};

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: '探す',
    items: [
      {
        name: '団員の視聴ログ',
        desc: '1,419件の配信を探索・記録',
        href: '/streams',
      },
      {
        name: '楽曲ライブラリ',
        desc: '452曲のレパートリー・セトリ検索',
        href: '/music',
      },
      {
        name: '今日のASMR',
        desc: '気分に合わせたASMRを今日一本',
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
