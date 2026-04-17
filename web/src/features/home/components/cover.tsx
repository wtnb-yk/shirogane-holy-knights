export function Cover() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-lg pt-xl md:pt-2xl pb-lg md:pb-xl bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,var(--glow-gold)_0%,transparent_100%),var(--color-page)]">
      <div
        className="text-[1.2rem] md:text-[1.4rem] text-silver-300"
        style={{ animation: 'fade-up 0.5s var(--ease-out-expo) 0.1s both' }}
      >
        &#9876;
      </div>
      <div
        className="h-0.5 bg-accent rounded-[1px] my-md md:my-lg"
        style={{ animation: 'draw-line 0.7s var(--ease-out-expo) 0.3s both' }}
      />
      <h1
        className="font-body text-2xl md:text-4xl font-bold text-heading tracking-[-0.01em] leading-[1.1]"
        style={{ animation: 'fade-up 0.6s var(--ease-out-expo) 0.6s both' }}
      >
        だんいんログ
      </h1>
      <p
        className="text-sm md:text-lg text-muted mt-xs md:mt-sm"
        style={{ animation: 'fade-up 0.5s var(--ease-out-expo) 0.9s both' }}
      >
        団員の推し活を、もっと楽しく。
      </p>
      <p
        className="font-mono text-[10px] md:text-xs text-silver-400 tracking-[0.1em] mt-lg md:mt-xl"
        style={{ animation: 'fade-up 0.4s var(--ease-out-expo) 1.2s both' }}
      >
        白銀ノエル非公式ファンサイト
      </p>
    </section>
  );
}
