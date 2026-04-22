import { StateToggle } from '@/components/ui/state-toggle';
import type { ViewMode, SongSort } from '../hooks/use-music-filter';

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'stream', label: '配信で見る' },
  { key: 'song', label: '曲で見る' },
];

const SORT_OPTIONS: { value: SongSort; label: string }[] = [
  { value: 'count', label: '歌唱回数' },
  { value: 'recent', label: '最終歌唱日' },
  { value: 'name', label: 'あいうえお順' },
];

type Props = {
  viewMode: ViewMode;
  songSort: SongSort;
  onSetViewMode: (mode: ViewMode) => void;
  onSetSongSort: (sort: SongSort) => void;
};

/** 歌枠タブ専用ツールバー（ビューモード切替 + ソートドロップダウン） */
export function UtawakuToolbar({
  viewMode,
  songSort,
  onSetViewMode,
  onSetSongSort,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-md gap-md">
      <StateToggle
        options={VIEW_OPTIONS}
        activeKey={viewMode}
        onSelect={onSetViewMode}
      />
      {viewMode === 'song' && (
        <div className="flex items-center gap-xs">
          <label className="text-xs text-muted">並び替え</label>
          <select
            value={songSort}
            onChange={(e) => onSetSongSort(e.target.value as SongSort)}
            className="px-2 py-1 font-body text-xs text-interactive bg-surface border border-border rounded-sm outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
