import { getStreams, getStreamTagsWithCount } from '@/lib/data/streams';
import { StreamsPage } from '@/features/streams/components/streams-page';

export default function Page() {
  const streams = getStreams();
  const tagsWithCount = getStreamTagsWithCount();

  return <StreamsPage streams={streams} tagsWithCount={tagsWithCount} />;
}
