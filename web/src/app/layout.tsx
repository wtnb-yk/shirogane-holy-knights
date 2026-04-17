import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { M_PLUS_2 } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import '@/styles/globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const mplus2 = M_PLUS_2({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://danin-log.vercel.app';

export const metadata: Metadata = {
  title: 'だんいんログ',
  description: '白銀ノエルファン（団員）のための推し活記録アプリ',
  openGraph: {
    title: 'だんいんログ',
    description: '白銀ノエルファン（団員）のための推し活記録アプリ',
    siteName: 'だんいんログ',
    images: [{ url: `${siteUrl}/api/og`, width: 1200, height: 630 }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'だんいんログ',
    description: '白銀ノエルファン（団員）のための推し活記録アプリ',
    images: [`${siteUrl}/api/og`],
  },
};

const themeScript = `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${outfit.variable} ${mplus2.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
