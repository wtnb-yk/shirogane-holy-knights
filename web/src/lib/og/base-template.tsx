/**
 * OGP 画像のベーステンプレート
 *
 * 全 OGP 画像で共通の外枠・ブランディングを提供する。
 * 各機能（A1, B5, B4a 等）は children に独自コンテンツを渡す。
 *
 * サイズ: 1200 x 630（OGP 標準）
 */

/** デザイントークン（globals.css と同じ値。Satori は CSS 変数を解釈できないため直値） */
export const OG = {
  width: 1200,
  height: 630,

  // パレット
  dark900: '#1A1D24',
  dark800: '#2A2D35',
  navy700: '#303845',
  navy500: '#545D68',
  navy300: '#888F99',
  cream50: '#FCFCFD',
  cream100: '#F8F8FA',
  cream200: '#EDEDF0',
  gold400: '#C8A24C',
  gold300: '#D4B56A',
  gold500: '#A6852E',
  gold100: '#F2E6C4',

  // フォント
  fontBody: 'M PLUS 2',
  fontDisplay: 'Outfit',
} as const;

/**
 * ベーステンプレート
 *
 * 背景 + ゴールドアクセント + 下部ブランディングバー + 中央コンテンツ領域
 */
export function OgBaseTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: OG.width,
        height: OG.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,162,76,0.08) 0%, transparent 100%), ${OG.dark900}`,
        fontFamily: OG.fontBody,
        color: OG.cream100,
        position: 'relative',
      }}
    >
      {/* コンテンツ領域 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '60px 80px 0',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* 下部ブランディングバー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          width: '100%',
          padding: '24px 80px',
          borderTop: `1px solid ${OG.navy700}`,
        }}
      >
        <span
          style={{
            fontFamily: OG.fontBody,
            fontSize: 16,
            fontWeight: 700,
            color: OG.gold100,
            letterSpacing: '0.02em',
          }}
        >
          だんいんログ
        </span>
        <span
          style={{
            fontSize: 12,
            color: OG.navy500,
          }}
        >
          白銀ノエル非公式ファンサイト
        </span>
      </div>
    </div>
  );
}

/**
 * デフォルト OGP コンテンツ（サイトトップ用）
 */
export function OgDefaultContent() {
  return (
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
      <div style={{ fontSize: 32, color: OG.cream200 }}>&#9876;</div>

      {/* ゴールドライン */}
      <div
        style={{
          width: 48,
          height: 2,
          background: OG.gold400,
          borderRadius: 1,
          margin: '20px 0',
        }}
      />

      {/* タイトル */}
      <div
        style={{
          fontFamily: OG.fontBody,
          fontSize: 64,
          fontWeight: 700,
          color: OG.cream50,
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
        }}
      >
        だんいんログ
      </div>

      {/* タグライン */}
      <div
        style={{
          fontSize: 24,
          color: OG.navy300,
          marginTop: 16,
        }}
      >
        団員の推し活を、もっと楽しく。
      </div>
    </div>
  );
}
