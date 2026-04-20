import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'オフライン',
};

export default function OfflinePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-md px-md py-2xl">
      <p className="font-mono text-xs tracking-wide text-muted uppercase">
        Offline
      </p>
      <h1 className="font-display text-2xl font-bold text-heading">
        オフラインです
      </h1>
      <p className="text-secondary text-center">
        インターネットに接続されていません。
        <br />
        接続を確認してから、もう一度お試しください。
      </p>
    </section>
  );
}
