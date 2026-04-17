#!/usr/bin/env python3
"""ライブからの楽曲抽出。"""

import sys
from extract_songs_common import (
    get_youtube_service, get_tagged_video_ids, extract_from_videos,
    load_songs_master, normalize_and_save, write_csv,
)


def main():
    try:
        youtube = get_youtube_service()
    except ValueError as e:
        print(f'エラー: {e}')
        sys.exit(1)

    songs_master, songs_index = load_songs_master()
    print(f'既存曲マスタ: {len(songs_master)}件\n')

    print('=== ライブ ===')
    videos = get_tagged_video_ids('ライブ')
    print(f'{len(videos)}件の動画\n')

    if videos:
        extracted = extract_from_videos(youtube, videos)
        print(f'\n=== data-staging/ に出力 ===')
        normalize_and_save(extracted, 'concert_songs.csv', 'extracted_songs_live.csv', songs_master, songs_index)
        write_csv('songs.csv', ['id', 'title', 'artist'], songs_master)

    print('完了')


if __name__ == '__main__':
    main()
