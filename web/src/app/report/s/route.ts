import { type NextRequest } from 'next/server';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { decodeShareParams } from '@/features/report/lib/share-params';

/**
 * OGP共有用エンドポイント
 *
 * - Twitterクローラー: OGメタタグを読み取ってカードプレビューを生成
 * - ブラウザ: JS で /report にリダイレクト
 * - Route Handler なのでレイアウト(Header等)を経由しない → SQLite不要
 */
export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get('d') ?? '';
  const data = decodeShareParams({ d });

  const title = '白銀聖騎士団 団員レポート';
  const description = data
    ? `⚔ ${data.streamCount}本の配信を視聴（カバー率${data.coverageRate}%）`
    : 'あなたの視聴記録から、報告書を生成します。';

  // og:image URL は単一パラメータなので &amp; 問題なし
  const ogImageUrl = d
    ? `${SITE_URL}/api/og/report?d=${d}`
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
<body><script>location.replace('${SITE_URL}/report')</script></body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
