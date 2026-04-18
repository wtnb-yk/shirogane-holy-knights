import type { Metadata } from 'next';
import { getStreams, getStreamTagsWithCount } from '@/lib/data/streams';
import { StreamsPage } from '@/features/streams/components/streams-page';

export const metadata: Metadata = {
  title: '配信',
  description:
    '白銀ノエルの配信アーカイブをタグで探索。視聴記録をチェックして振り返り。',
};

export default function Page() {
  const streams = getStreams();
  const tagsWithCount = getStreamTagsWithCount();

  return <StreamsPage streams={streams} tagsWithCount={tagsWithCount} />;
}
