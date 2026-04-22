import { type NextRequest } from 'next/server';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { decodeShareParams } from '@/features/report/lib/share-params';

/**
 * OGP共有用エンドポイント
 *
 * - Twitterクローラー: OGメタタグを読み取ってカードプレビューを生成
 * - ブラウザ: meta refresh で /report にリダイレクト
 * - Route Handler なのでレイアウト(Header等)を経由しない → SQLite不要
 */
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const data = decodeShareParams(params);

  const title = '白銀聖騎士団 団員レポート';
  const description = data
    ? `⚔ ${data.streamCount}本の配信を視聴（カバー率${data.coverageRate}%）`
    : 'あなたの視聴記録から、報告書を生成します。';

  let ogImageUrl = `${SITE_URL}/api/og`;
  if (data) {
    const ogParams = new URLSearchParams();
    ogParams.set('sc', String(data.streamCount));
    ogParams.set('cr', String(data.coverageRate));
    ogParams.set('wa', String(data.weeklyAverage));
    ogParams.set('ms', String(data.maxStreak));
    ogParams.set('fs', String(data.favoriteSongCount));
    if (data.genres.length > 0) {
      ogParams.set(
        'g',
        data.genres.map((g) => `${g.name}:${g.count}`).join(','),
      );
    }
    const themeKey =
      data.theme === 'dark' ? 'd' : data.theme === 'gold' ? 'g' : 'l';
    ogParams.set('t', themeKey);
    ogImageUrl = `${SITE_URL}/api/og/report?${ogParams.toString()}`;
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${SITE_URL}/report">
<title>${title} — ${SITE_NAME}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImageUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImageUrl)}">
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
