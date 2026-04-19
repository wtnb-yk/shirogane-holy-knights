import { ImageResponse } from 'next/og';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG, OgBaseTemplate } from '@/lib/og/base-template';

export const runtime = 'edge';

export async function GET() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgBaseTemplate>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {/* ヒートマップ風ドットパターン（装飾） */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 32,
          }}
        >
          {Array.from({ length: 7 }).map((_, row) => (
            <div
              key={row}
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {Array.from({ length: 7 }).map((_, col) => {
                const seed = (row * 7 + col) * 17;
                const prob = ((seed % 100) / 100) * 0.6 + row * 0.05;
                const color =
                  prob > 0.7
                    ? OG.gold400
                    : prob > 0.4
                      ? OG.gold300
                      : prob > 0.2
                        ? OG.gold100
                        : OG.navy700;
                return (
                  <div
                    key={col}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: color,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* ラベル */}
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: OG.gold400,
          }}
        >
          FOOTPRINT
        </div>

        {/* ゴールドライン */}
        <div
          style={{
            width: 40,
            height: 2,
            background: OG.gold400,
            borderRadius: 1,
            margin: '16px 0',
          }}
        />

        {/* タイトル */}
        <div
          style={{
            fontFamily: OG.fontBody,
            fontSize: 52,
            fontWeight: 700,
            color: OG.cream50,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          団員のあしあと
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 20,
            color: OG.navy300,
            marginTop: 16,
          }}
        >
          あなたの視聴履歴をヒートマップで可視化
        </div>
      </div>
    </OgBaseTemplate>,
    {
      width: OG.width,
      height: OG.height,
      fonts,
    },
  );
}
