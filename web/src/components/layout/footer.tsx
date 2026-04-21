import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mx-auto max-w-[var(--content-max)] w-full border-t border-border text-center px-md md:px-lg pt-xl pb-xl md:pt-xl md:pb-2xl">
      <p className="text-3xs md:text-xs text-faint leading-relaxed">
        だんいんログ &mdash; 白銀ノエル非公式ファンサイト
      </p>
      <p className="text-3xs md:text-xs text-faint leading-relaxed mt-0.5">
        白銀ノエルさん及びカバー株式会社とは一切関係ありません
      </p>
      <p className="text-3xs md:text-xs text-faint mt-sm">
        <Link
          href="/about"
          className="hover:text-link-hover underline underline-offset-2"
        >
          このサイトについて
        </Link>
      </p>
    </footer>
  );
}
