import { ImageResponse } from 'next/og';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG } from '@/lib/og/base-template';

export const runtime = 'edge';

export async function GET() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <div
      style={{
        width: OG.width,
        height: OG.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, ${OG.cream100} 0%, ${OG.cream200} 40%, rgba(212,181,106,0.15) 100%)`,
        fontFamily: OG.fontBody,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 左上装飾: ライン群 */}
      <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 180 - i * 40,
              background:
                i === 0 ? OG.gold400 : `rgba(200,162,76,${0.3 - i * 0.1})`,
              marginLeft: i === 0 ? 80 : 12,
              marginTop: 0,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* 右下装飾: ライン群 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 180 - i * 40,
              background:
                i === 0 ? OG.gold400 : `rgba(200,162,76,${0.3 - i * 0.1})`,
              marginRight: i === 0 ? 80 : 12,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* 左の装飾ドット */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transform: 'translateY(-50%)',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                i === 2
                  ? OG.gold400
                  : `rgba(200,162,76,${0.2 + (2 - Math.abs(i - 2)) * 0.15})`,
            }}
          />
        ))}
      </div>

      {/* 右の装飾ドット */}
      <div
        style={{
          position: 'absolute',
          right: 50,
          top: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transform: 'translateY(-50%)',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                i === 2
                  ? OG.gold400
                  : `rgba(200,162,76,${0.2 + (2 - Math.abs(i - 2)) * 0.15})`,
            }}
          />
        ))}
      </div>

      {/* 中央コンテンツ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* 剣アイコン */}
        <div style={{ fontSize: 36, color: OG.navy700 }}>&#9876;</div>

        {/* ゴールドライン */}
        <div
          style={{
            width: 48,
            height: 2,
            background: OG.gold400,
            borderRadius: 1,
            margin: '24px 0',
          }}
        />

        {/* タイトル */}
        <div
          style={{
            fontFamily: OG.fontBody,
            fontSize: 72,
            fontWeight: 700,
            color: OG.dark800,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          だんいんログ
        </div>

        {/* タグライン */}
        <div
          style={{
            fontSize: 22,
            color: OG.navy500,
            marginTop: 16,
          }}
        >
          団員の推し活を、もっと楽しく。
        </div>
      </div>

      {/* 非公式表記 */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          fontSize: 11,
          color: OG.navy500,
        }}
      >
        白銀ノエル非公式ファンサイト
      </div>
    </div>,
    {
      width: OG.width,
      height: OG.height,
      fonts,
    },
  );
}
