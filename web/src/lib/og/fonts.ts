/**
 * OGP 画像生成用フォント読み込み
 *
 * Google Fonts CSS2 API から woff フォントを取得する。
 * Edge Runtime で動作する。
 */

type FontWeight = 400 | 600 | 700;

type FontDef = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: 'normal';
};

async function fetchFont(
  family: string,
  weight: FontWeight,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;

  const cssRes = await fetch(url, {
    headers: {
      // woff を返させる User-Agent（woff2 は Satori 非対応）
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  });
  const css = await cssRes.text();

  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match?.[1]) {
    throw new Error(`Font URL not found in CSS for ${family}:${weight}`);
  }

  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

let cache: FontDef[] | null = null;

export async function loadOgFonts(): Promise<FontDef[]> {
  if (cache) return cache;

  const [body400, body700, display600] = await Promise.all([
    fetchFont('M PLUS 2', 400),
    fetchFont('M PLUS 2', 700),
    fetchFont('Outfit', 600),
  ]);

  cache = [
    { name: 'M PLUS 2', data: body400, weight: 400, style: 'normal' },
    { name: 'M PLUS 2', data: body700, weight: 700, style: 'normal' },
    { name: 'Outfit', data: display600, weight: 600, style: 'normal' },
  ];

  return cache;
}
