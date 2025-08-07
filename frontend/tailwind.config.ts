import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // 統一カラーパレット（白銀聖騎士団テーマ）
        shirogane: {
          bg: {
            primary: '#F8F9FA',    // メイン背景（現在のnoel-bg-light）
            secondary: '#F9F7F4',  // セクション背景（現在のbrand-cream）
            accent: '#ACBDC5',     // アクセント背景（現在のsage-100）
          },
          text: {
            primary: '#374553',    // メインテキスト
            secondary: '#89939d',  // サブテキスト
            muted: '#acabb2',      // 薄いテキスト
          },
          surface: {
            primary: '#324353',    // ヘッダーなど
            secondary: '#8B9DC3',  // カード背景など
            border: '#acabb2',     // ボーダー色
          },
          accent: {
            gold: '#F6C794',
            blue: '#8B9DC3',
            beige: '#DDB892',
            green: '#5BA179',
          },
          error: {
            DEFAULT: '#ef4444', // red-500相当
            light: '#fca5a5',   // red-300相当  
            dark: '#dc2626'     // red-600相当
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
