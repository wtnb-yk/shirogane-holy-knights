import type {Config} from 'tailwindcss'
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
      animation: {
        'stagger-fade': 'fadeIn 0.4s ease-out forwards var(--animation-delay, 0ms)',
        'card-hover': 'cardHover 0.3s ease-out forwards',
      },
      transitionDuration: {
        'card': '300ms',
        'ui': '200ms',
        'fast': '150ms',
      },
      colors: {
        bg: {
          primary: '#FFFFFF',    // メイン背景（現在のnoel-bg-light）
          secondary: '#F9F7F4',  // セクション背景（現在のbrand-cream）
          accent: '#ACBDC5',     // アクセント背景（現在のsage-100）
        },
        text: {
          primary: '#374553',    // メインテキスト
          secondary: '#89939d',  // サブテキスト
          muted: '#acabb2',      // 薄いテキスト
          light: '#e5e7eb',      // 明るいテキスト
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
        badge: {
          blue: '#4A90E2',      // 鮮やかなブルー（グッズ用）
          green: '#7ED321',     // 鮮やかなグリーン（コラボ用）
          orange: '#F5A623',    // 鮮やかなオレンジ（イベント用）
          purple: '#9013FE',    // 鮮やかなパープル（メディア用）
          gray: '#9B9B9B',      // デフォルト用グレー
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fca5a5',
          dark: '#dc2626'
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
