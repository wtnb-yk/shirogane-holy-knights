import type { Stream } from '@/lib/data/types';
import { TagPill } from '@/components/ui/tag-pill';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatDuration(dur: string): string {
  const parts = dur.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m] = parts;
    if (h > 0) return `${h}h${String(m).padStart(2, '0')}m`;
    return `${m}m`;
  }
  return dur;
}

type Props = {
  stream: Stream;
  visible: boolean;
};

export function ResultInfo({ stream, visible }: Props) {
  return (
    <div
      className={`w-full mb-xl text-left transition-all duration-500 ease-out-expo ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      }`}
    >
      <p className="text-base font-semibold text-heading leading-[1.5] mb-xs">
        {stream.title}
      </p>
      <p className="font-mono text-xs text-subtle mb-sm">
        {formatDate(stream.startedAt)} — {formatDuration(stream.duration)}
      </p>
      {stream.tags.length > 0 && (
        <div className="flex gap-2xs flex-wrap">
          {stream.tags.map((tag) => (
            <TagPill key={tag.id} label={tag.name} variant="small" />
          ))}
        </div>
      )}
    </div>
  );
}
