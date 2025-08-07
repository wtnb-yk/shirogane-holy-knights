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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'youtube': {
          'red': '#FF0000',          // YouTube公式赤
          'dark': '#282828',         // YouTube暗色
          'light': '#F9F9F9',        // YouTube明色
        },
        // 統一カラーパレット（白銀聖騎士団テーマ）
        'shirogane': {
          'bg': {
            'primary': '#F8F9FA',    // メイン背景（現在のnoel-bg-light）
            'secondary': '#F9F7F4',  // セクション背景（現在のbrand-cream）
            'accent': '#ACBDC5',     // アクセント背景（現在のsage-100）
          },
          'text': {
            'primary': '#374553',    // メインテキスト（現在のbrand-charcoal）
            'secondary': '#89939d',  // サブテキスト（現在のsage-300）
            'muted': '#acabb2',      // 薄いテキスト（現在のsage-200）
          },
          'surface': {
            'primary': '#324353',    // ヘッダーなど（現在のbrand-navy）
            'secondary': '#8B9DC3',  // カード背景など（現在のnoel-primary）
            'border': '#acabb2',     // ボーダー色（現在のsage-200）
          },
          'accent': {
            'gold': '#F6C794',       // ゴールド（現在のbrand-gold）
            'blue': '#8B9DC3',       // ブルー（現在のnoel-primary）
            'beige': '#DDB892',      // ベージュ（現在のnoel-secondary）
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
