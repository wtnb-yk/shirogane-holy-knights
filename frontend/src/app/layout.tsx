import type { Metadata } from 'next';
import './globals.css';

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
      <body>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">団員ポータル</h1>
          </div>
        </header>
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