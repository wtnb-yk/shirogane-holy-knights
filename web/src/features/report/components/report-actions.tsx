import { Button } from '@/components/ui/button';
import { DownloadIcon, XIcon } from '@/components/ui/icons';

type Props = {
  downloading: boolean;
  onDownload: () => void;
  onShare: () => void;
};

export function ReportActions({ downloading, onDownload, onShare }: Props) {
  return (
    <div className="flex gap-sm max-md:flex-col max-md:w-full mb-md animate-card-entrance-delayed">
      <Button
        variant="primary"
        onClick={onDownload}
        disabled={downloading}
        className={downloading ? 'opacity-70' : ''}
      >
        {downloading ? (
          '準備中...'
        ) : (
          <>
            <DownloadIcon />
            画像をダウンロード
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        onClick={onShare}
        className="max-md:w-full max-md:justify-center"
      >
        <XIcon />
        Xでシェア
      </Button>
    </div>
  );
}
