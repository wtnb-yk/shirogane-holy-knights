import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';
import { TagPill } from '@/components/ui/tag-pill';

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
