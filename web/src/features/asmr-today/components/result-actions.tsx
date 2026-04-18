import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';

type Props = {
  stream: Stream;
  onRetry: () => void;
};

export function ResultActions({ stream, onRetry }: Props) {
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
          disabled
          className="max-md:w-full max-md:justify-center"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 2v9M4 8l4 4 4-4" />
            <path d="M2 13h12" />
          </svg>
          画像をダウンロード
        </Button>
      </div>
      <Button variant="ghost" onClick={onRetry}>
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-3.5 h-3.5"
        >
          <path d="M1 9a8 8 0 0 1 14.3-4.9M17 9a8 8 0 0 1-14.3 4.9" />
          <path d="M15.3 1v3.1h-3.1M2.7 17v-3.1h3.1" />
        </svg>
        もう一回
      </Button>
    </div>
  );
}
