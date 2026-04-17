#!/usr/bin/env python3
"""
YouTube コメントから楽曲セットリストを抽出する。

使い方:
  python3 extract_songs.py                # 歌枠+ライブ両方
  python3 extract_songs.py --type stream  # 歌枠のみ
  python3 extract_songs.py --type live    # ライブのみ
"""

import argparse
import sys

from extract_songs_common import (
    get_youtube_service,
    get_tagged_video_ids,
    process_videos,
)


def main():
    parser = argparse.ArgumentParser(description='YouTube コメントから楽曲抽出')
    parser.add_argument('--type', choices=['stream', 'live', 'all'], default='all')
    args = parser.parse_args()

    try:
        youtube = get_youtube_service()
    except ValueError as e:
        print(f'エラー: {e}')
        sys.exit(1)

    targets = {
        'stream': [('歌枠', 'extracted_songs_stream.csv')],
        'live': [('ライブ', 'extracted_songs_live.csv')],
        'all': [('歌枠', 'extracted_songs_stream.csv'), ('ライブ', 'extracted_songs_live.csv')],
    }

    for tag_name, filename in targets[args.type]:
        print(f'\n=== {tag_name} ===')
        videos = get_tagged_video_ids(tag_name)
        print(f'{len(videos)}件の動画')

        if videos:
            process_videos(youtube, videos, filename, tag_name)
        else:
            print(f'  動画が見つかりませんでした')

    print('\n完了')


if __name__ == '__main__':
    main()
