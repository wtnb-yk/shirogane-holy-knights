import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, XIcon } from '@/components/ui/icons';
import { RetryIcon } from './icons';

type Props = {
  stream: Stream;
  onRetry: () => void;
};

export function ResultActions({ stream, onRetry }: Props) {
  const handleShare = () => {
    const text = `今日のASMRは「${stream.title}」に決まり！\n#だんいんログ #白銀ノエル`;
    const url = `https://www.youtube.com/watch?v=${stream.id}`;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="flex flex-col items-center gap-sm animate-fade-up-delay">
      <div className="flex gap-sm max-md:flex-col max-md:w-full">
        <Button
          variant="primary"
          onClick={() =>
            window.open(
              `https://www.youtube.com/watch?v=${stream.id}`,
              '_blank',
              'noopener,noreferrer',
            )
          }
          className="max-md:w-full max-md:justify-center"
        >
          <ExternalLinkIcon />
          YouTubeで聴く
        </Button>
        <Button
          variant="secondary"
          onClick={handleShare}
          className="max-md:w-full max-md:justify-center"
        >
          <XIcon className="w-3.5 h-3.5" />
          Xに共有する
        </Button>
      </div>
      <Button variant="ghost" onClick={onRetry}>
        <RetryIcon className="w-3.5 h-3.5" />
        もう一回
      </Button>
    </div>
  );
}
