import type {Config} from 'tailwindcss'

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
    },
  },
  plugins: [],
}

export default config
