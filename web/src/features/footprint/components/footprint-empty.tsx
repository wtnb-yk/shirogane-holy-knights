import { Button } from '@/components/ui/button';
import { emptyHeatmap } from '../lib/compute-heatmap';
import { FootprintCard } from './footprint-card';

const EMPTY_DATA = emptyHeatmap(new Date().getFullYear());

export function FootprintEmpty() {
  return (
    <div className="flex flex-col items-center">
      <div className="opacity-25 pointer-events-none">
        <FootprintCard data={EMPTY_DATA} />
      </div>

      <div className="text-center mt-xl animate-card-entrance-delayed">
        <p className="text-sm text-secondary leading-[1.8] mb-md">
          配信でチェックすると、
          <br />
          ここにあなたのあしあとが表示されます。
        </p>
        <a href="/streams">
          <Button variant="cta">配信を開く</Button>
        </a>
      </div>
    </div>
  );
}
