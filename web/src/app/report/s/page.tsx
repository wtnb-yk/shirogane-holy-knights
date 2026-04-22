import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { decodeShareParams } from '@/features/report/lib/share-params';
import { ShareRedirect } from './share-redirect';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const data = decodeShareParams(params);

  if (!data) {
    return {
      title: '団員レポート',
      description: 'あなたの視聴記録から、報告書を生成します。',
      robots: { index: false, follow: false },
    };
  }

  const ogParams = new URLSearchParams();
  ogParams.set('sc', String(data.streamCount));
  ogParams.set('cr', String(data.coverageRate));
  ogParams.set('wa', String(data.weeklyAverage));
  ogParams.set('ms', String(data.maxStreak));
  ogParams.set('fs', String(data.favoriteSongCount));
  if (data.genres.length > 0) {
    ogParams.set('g', data.genres.map((g) => `${g.name}:${g.count}`).join(','));
  }
  const themeKey =
    data.theme === 'dark' ? 'd' : data.theme === 'gold' ? 'g' : 'l';
  ogParams.set('t', themeKey);

  const ogUrl = `${SITE_URL}/api/og/report?${ogParams.toString()}`;
  const description = `⚔ ${data.streamCount}本の配信を視聴（カバー率${data.coverageRate}%）`;

  return {
    title: '団員レポート',
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: '白銀聖騎士団 団員レポート',
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: '白銀聖騎士団 団員レポート',
      description,
      images: [ogUrl],
    },
  };
}

export default function Page() {
  return <ShareRedirect />;
}
