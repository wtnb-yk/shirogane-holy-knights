import type { Metadata } from 'next';
import { getAsmrStreams } from '@/lib/data/asmr';
import { AsmrPage } from '@/features/asmr-today/components/asmr-page';

export const metadata: Metadata = {
  title: '今日のASMR',
  description:
    'どれを聴くか迷ったら。ASMRアーカイブからランダムで1本おすすめします。',
};

export default function Page() {
  const streams = getAsmrStreams();
  return <AsmrPage streams={streams} />;
}
