import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          白銀ノエルファン - 団員ポータル
        </h1>

        <p className="mt-3 text-2xl">
          白銀ノエルさんのファン（団員）向けポータルサイト
        </p>

        <div className="mt-6">
          <a
            href="/archives"
            className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            アーカイブ一覧を見る
          </a>
        </div>
      </main>
    </div>
  );
}