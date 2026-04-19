/**
 * OGP 画像の共通定数
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
