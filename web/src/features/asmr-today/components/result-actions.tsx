import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
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
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7 3L13 3L13 9" />
            <path d="M13 3L6 10" />
          </svg>
          YouTubeで聴く
        </Button>
        <Button
          variant="secondary"
          onClick={handleShare}
          className="max-md:w-full max-md:justify-center"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12.6 2h2.1L10 7.6 15.3 14h-4.4L7.6 9.7 3.8 14H1.6l5.1-5.8L1.3 2h4.5l3 3.9L12.6 2zm-.7 10.8h1.2L4.8 3.3H3.5l8.4 9.5z" />
          </svg>
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
