import type { Metadata, Viewport } from 'next';
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { FloatingYouTubeLink } from '@/components/common/FloatingYouTubeLink';
import { WebSiteSchema, OrganizationSchema } from '@/components/seo/JsonLd';
import { GoogleAnalyticsWrapper } from '@/components/analytics/GoogleAnalytics';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { ToastProvider } from '@/components/common/Toast';
import { PerformanceOptimizations } from '@/components/seo/PerformanceOptimizations';

const mplusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mplus-rounded',
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさんの非公式ファンサイト「だんいんポータル」はホロライブ3期生の白銀ノエル団長を応援する非公式ファンサイトです。最新ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの非公式ファンサイト「だんいんポータル」はホロライブ3期生の白銀ノエル団長を応援する非公式ファンサイトです。最新ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの非公式ファンサイト「だんいんポータル」はホロライブ3期生の白銀ノエル団長を応援する非公式ファンサイトです。最新ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" dir="ltr">
      <body className={`min-h-screen flex flex-col ${mplusRounded.variable} ${notoSansJP.variable}`}>
        <PerformanceOptimizations />
        <GoogleAnalyticsWrapper />
        <WebSiteSchema />
        <OrganizationSchema />
        <ToastProvider>
          <OfflineIndicator />
          <ErrorBoundary>
            <Header />
            <main
              className="flex-grow pt-16"
              role="main"
            >
              {children}
            </main>
            <Footer />
            <FloatingYouTubeLink />
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
