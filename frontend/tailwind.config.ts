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
        // カスタムカラーパレット
        'sage': {
          100: '#ACBDC5',
          200: '#acabb2', 
          300: '#89939d',
        },
        'custom-bg': '#f8f9fa',
        'custom-card': '#ffffff',
        // ブランドカラー
        'brand': {
          'navy': '#324353',      // ヘッダー背景
          'gold': '#F6C794',      // アクセントライン
          'cream': '#F9F7F4',     // フッター背景
          'charcoal': '#374553',  // テキスト色
        },
        // ノエル専用カラーパレット
        'noel': {
          'primary': '#8B9DC3',      // ノエルブルー
          'secondary': '#DDB892',    // ゴールドアクセント  
          'bg-light': '#F8F9FA',     // 薄い背景
          'text-primary': '#2D3748', // メインテキスト
          'text-secondary': '#718096', // サブテキスト
        },
        'youtube': {
          'red': '#FF0000',          // YouTube公式赤
          'dark': '#282828',         // YouTube暗色
          'light': '#F9F9F9',        // YouTube明色
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config