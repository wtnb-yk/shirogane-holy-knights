import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header/Header';

export const metadata: Metadata = {
  title: '白銀ノエルファン - 団員ポータル',
  description: '白銀ノエルさんのファン（団員）向けポータルサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <footer className="bg-white shadow mt-10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            &copy; 2025 団員ポータル
          </div>
        </footer>
      </body>
    </html>
  );
}