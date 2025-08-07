import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';

const mplusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mplus-rounded',
});

export const metadata: Metadata = {
  title: '白銀ノエルファン - 団員ポータル',
  description: '白銀ノエルさんのファン（団員）向けポータルサイト',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`min-h-screen flex flex-col ${mplusRounded.variable}`}>
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}