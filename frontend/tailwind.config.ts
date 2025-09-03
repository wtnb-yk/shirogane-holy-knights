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
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', '"Hiragino Sans"', 'var(--font-noto-sans-jp)', 'Arial', 'sans-serif'],
        'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', '"Hiragino Sans"', 'Arial', 'sans-serif'],
        'japanese': ['var(--font-noto-sans-jp)', '"Hiragino Sans"', 'ヒラギノ角ゴ Pro W3', 'メイリオ', 'Meiryo', 'sans-serif'],
        'rounded': ['var(--font-mplus-rounded)', 'M PLUS Rounded 1c', 'sans-serif'],
      },
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
          primary: '#FFFFFF',    // メイン背景
          secondary: '#F9F7F4',  // セクション背景
          tertiary: '#F5F5F5',   // サイドバー背景
          hover: '#FEF3E2',      // ホバー背景
          accent: '#ACBDC5',     // アクセント背景
        },
        text: {
          primary: '#1F2937',    // メインテキスト（gray-800相当）
          secondary: '#6B7280',  // サブテキスト（gray-500相当）
          tertiary: '#9CA3AF',   // 薄いテキスト（gray-400相当）
          inverse: '#FFFFFF',    // 白テキスト
          muted: '#acabb2',      // 薄いテキスト（従来）
          light: '#e5e7eb',      // 明るいテキスト（従来）
        },
        surface: {
          primary: '#324353',    // ヘッダーなど
          secondary: '#8B9DC3',  // カード背景など
          border: '#E5E7EB',     // ボーダー色（gray-200相当）
          hover: '#F3F4F6',      // ホバー用サーフェス
        },
        accent: {
          gold: '#F6C794',
          'gold-hover': '#F4B87D',  // ゴールドホバー
          'gold-light': '#FEF3E2',  // ゴールド薄色
          'gold-dark': '#D89C5B',   // ゴールド濃色
          blue: '#8B9DC3',
          beige: '#DDB892',
          green: '#5BA179',
          youtube: '#FF4444',
        },
        badge: {
          blue: '#4A90E2',
          green: '#7ED321',
          orange: '#F5A623',
          purple: '#9013FE',
          pink: '#FF69B4',
          gray: '#9B9B9B',
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
