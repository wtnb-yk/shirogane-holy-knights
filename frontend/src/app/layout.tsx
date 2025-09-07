import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { FloatingYouTubeLink } from '@/components/common/FloatingYouTubeLink';
import { WebSiteSchema, OrganizationSchema } from '@/components/seo/JsonLd';

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

export const metadata: Metadata = {
  title: 'だんいんポータル',
  description: '白銀ノエルさんの非公式応援サイト',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'だんいんポータル',
    description: '白銀ノエルさんの非公式応援サイト。ニュース、配信アーカイブ、楽曲情報を検索・閲覧できます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'だんいんポータル - 白銀ノエル非公式応援サイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'だんいんポータル',
    description: '白銀ノエルさんの非公式応援サイト',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`min-h-screen flex flex-col ${mplusRounded.variable} ${notoSansJP.variable}`}>
        <WebSiteSchema />
        <OrganizationSchema />
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
        <FloatingYouTubeLink />
      </body>
    </html>
  );
}
