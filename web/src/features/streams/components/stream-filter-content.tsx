import type { StreamTagWithCount } from '@/lib/data/types';
import { TagPill } from '@/components/ui/tag-pill';
import {
  FilterSection,
  FilterEmptySection,
} from '@/components/ui/filter-panel';
import type { CheckFilter } from '../hooks/use-stream-filter';

const checkOptions: { value: CheckFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'unchecked', label: '未チェック' },
  { value: 'checked', label: 'チェック済み' },
];

type Props = {
  allTags: StreamTagWithCount[];
  activeTags: Set<number>;
  checkFilter: CheckFilter;
  onToggleTag: (id: number) => void;
  onCheckFilter: (f: CheckFilter) => void;
};

export function StreamFilterContent({
  allTags,
  activeTags,
  checkFilter,
  onToggleTag,
  onCheckFilter,
}: Props) {
  return (
    <>
      <div className="flex gap-1.5 px-md py-sm border-b border-border">
        {checkOptions.map((opt) => (
          <TagPill
            key={opt.value}
            label={opt.label}
            variant={opt.value === checkFilter ? 'gold' : 'filter'}
            active={opt.value === checkFilter}
            onClick={() => onCheckFilter(opt.value)}
          />
        ))}
      </div>
      <FilterSection title="配信タグ">
        <div className="flex flex-wrap gap-xs">
          {allTags.map((tag) => (
            <TagPill
              key={tag.id}
              label={tag.name}
              active={activeTags.has(tag.id)}
              onClick={() => onToggleTag(tag.id)}
            />
          ))}
        </div>
      </FilterSection>
      <FilterEmptySection
        title="ゲームタイトル"
        placeholder="タイトルを検索..."
      />
      <FilterEmptySection title="コラボ相手" placeholder="名前を検索..." />
      <FilterEmptySection title="年" />
    </>
  );
}
