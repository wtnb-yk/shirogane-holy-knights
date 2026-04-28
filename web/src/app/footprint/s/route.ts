import { type NextRequest } from 'next/server';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { decodeFootprintParams } from '@/features/footprint/lib/share-params';

/**
 * OGP共有用エンドポイント
 *
 * - Twitterクローラー: OGメタタグを読み取ってカードプレビューを生成
 * - ブラウザ: JS で /footprint にリダイレクト
 */
export async function GET(req: NextRequest) {
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const data = decodeFootprintParams(sp);

  const title = '団員のあしあと';
  const description = data
    ? `⚔ ${data.activeDays}日の視聴記録（最長連続${data.maxStreak}日・${data.totalChecks}本視聴）`
    : 'あなたの視聴履歴をヒートマップで可視化します。';

  const ogQuery = req.nextUrl.search;
  const ogImageUrl = data
    ? `${SITE_URL}/api/og/footprint${ogQuery}`
    : `${SITE_URL}/api/og`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${esc(title)} — ${esc(SITE_NAME)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImageUrl}">
</head>
<body><script>location.replace('${SITE_URL}/footprint')</script></body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
