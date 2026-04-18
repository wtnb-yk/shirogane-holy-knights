#!/usr/bin/env python3
"""ライブからの楽曲抽出。"""

import sys
from extract_songs_common import get_youtube_service, get_tagged_video_ids, process_videos


def main():
    try:
        youtube = get_youtube_service()
    except ValueError as e:
        print(f'エラー: {e}')
        sys.exit(1)

    print('=== ライブ ===')
    videos = get_tagged_video_ids('ライブ')
    print(f'{len(videos)}件の動画\n')

    if videos:
        process_videos(youtube, videos, 'extracted_songs_live.csv')
    print('完了')


if __name__ == '__main__':
    main()
