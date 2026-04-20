import { getStreams } from '@/lib/data/streams';
import { RevealStagger } from '@/components/ui/reveal';
import { HomeSectionHeader } from './home-section-header';
import { TodayStreams } from './today-streams';
import { SchedulePlaceholder } from './schedule-placeholder';

export function TodaySection() {
  const streams = getStreams().slice(0, 3);

  return (
    <section className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-xl md:pt-2xl">
      <HomeSectionHeader
        num="01"
        label="Today"
        title="最新の配信"
        description="ノエルの最新配信をチェックして、視聴記録をつけましょう。"
      />

      <RevealStagger className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-md">
        <TodayStreams streams={streams} />
        <SchedulePlaceholder />
      </RevealStagger>
    </section>
  );
}
