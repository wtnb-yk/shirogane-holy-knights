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
        {/* 剣アイコン */}
        <div style={{ fontSize: 28, color: OG.cream200 }}>&#9876;</div>

        {/* ラベル */}
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: OG.gold400,
            marginTop: 16,
          }}
        >
          ACTIVITY REPORT
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
          団員レポート
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 20,
            color: OG.navy300,
            marginTop: 16,
          }}
        >
          あなたの視聴記録から、報告書を生成します。
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
