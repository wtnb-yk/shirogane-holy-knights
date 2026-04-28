import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ExternalLinkIcon, XIcon } from '@/components/ui/icons';
import { track } from '@/lib/track';
import { bulkCheck } from '@/features/streams/lib/checked-streams';
import { RetryIcon } from './icons';

type Props = {
  stream: Stream;
  downloading: boolean;
  onDownload: () => void;
  onRetry: () => void;
};

export function ResultActions({
  stream,
  downloading,
  onDownload,
  onRetry,
}: Props) {
  const handleYoutube = () => {
    bulkCheck([stream.id]);
    window.open(
      `https://www.youtube.com/watch?v=${stream.id}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleShare = () => {
    const text = `今日のASMRは「${stream.title}」に決まり！\n#だんいんログ`;
    const url = `https://www.youtube.com/watch?v=${stream.id}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );
    track('share', { action: 'x', page: 'asmr' });
  };

  return (
    <div className="flex flex-col items-center gap-sm animate-fade-up-delay">
      <div className="flex gap-sm max-md:flex-col max-md:w-full">
        <Button
          variant="primary"
          onClick={handleYoutube}
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
      <div className="flex gap-sm">
        <Button variant="ghost" onClick={onDownload} disabled={downloading}>
          <DownloadIcon className="w-3.5 h-3.5" />
          {downloading ? '準備中...' : '画像を保存'}
        </Button>
        <Button variant="ghost" onClick={onRetry}>
          <RetryIcon className="w-3.5 h-3.5" />
          もう一回
        </Button>
      </div>
    </div>
  );
}
