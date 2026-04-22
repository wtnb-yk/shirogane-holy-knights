#!/usr/bin/env python3
"""歌枠からの楽曲抽出。"""

import sys
from extract_songs_common import get_youtube_service, get_tagged_video_ids, process_videos


def main():
    try:
        youtube = get_youtube_service()
    except ValueError as e:
        print(f'エラー: {e}')
        sys.exit(1)

    print('=== 歌枠 ===')
    videos = get_tagged_video_ids('歌枠', 'stream_songs')
    print(f'{len(videos)}件の動画\n')

    if videos:
        process_videos(youtube, videos, 'extracted_songs_stream.csv')
    print('完了')


if __name__ == '__main__':
    main()
