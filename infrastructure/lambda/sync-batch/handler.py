#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import subprocess
import traceback
from datetime import datetime
import boto3
import psycopg2
from psycopg2.extras import RealDictCursor
from googleapiclient.discovery import build
import pandas as pd
from io import StringIO

def get_secret(secret_name, region_name="ap-northeast-1", as_json=True):
    """AWS Secrets Managerから認証情報を取得"""
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        if as_json:
            return json.loads(response['SecretString'])
        else:
            return response['SecretString']
    except Exception as e:
        print(f"Error getting secret {secret_name}: {str(e)}")
        raise

def load_environment():
    """環境変数とSecrets Managerから設定を読み込み"""
    config = {}
    
    # RDS認証情報を取得
    if os.environ.get('USE_SECRETS_MANAGER', 'true').lower() == 'true':
        db_secret = get_secret(os.environ.get('DB_SECRET_NAME', 'shirogane-holy-knights-prd-db-credentials'))
        config['DB_HOST'] = os.environ.get('DB_HOST', db_secret.get('host', 'localhost'))
        config['DB_PORT'] = os.environ.get('DB_PORT', db_secret.get('port', '5432'))
        config['DB_NAME'] = os.environ.get('DB_NAME', db_secret.get('dbname', 'shirogane'))
        config['DB_USER'] = db_secret.get('username', 'postgres')
        config['DB_PASSWORD'] = db_secret.get('password', '')
    else:
        config['DB_HOST'] = os.environ.get('DB_HOST', 'localhost')
        config['DB_PORT'] = os.environ.get('DB_PORT', '5432')
        config['DB_NAME'] = os.environ.get('DB_NAME', 'shirogane')
        config['DB_USER'] = os.environ.get('DB_USER', 'postgres')
        config['DB_PASSWORD'] = os.environ.get('DB_PASSWORD', '')
    
    # YouTube API キーを取得
    if os.environ.get('USE_SECRETS_MANAGER', 'true').lower() == 'true':
        config['YOUTUBE_API_KEY'] = get_secret(os.environ.get('YOUTUBE_SECRET_NAME', 'shirogane-holy-knights-youtube-api-key'), as_json=False)
    else:
        config['YOUTUBE_API_KEY'] = os.environ.get('YOUTUBE_API_KEY', '')
    
    return config

def fetch_youtube_data(api_key, channel_id='UCdBK1mJKjm0B7ykJPsFQO6A'):
    """YouTube Data APIを使用して動画データを取得"""
    print(f"Fetching YouTube data for channel: {channel_id}")
    
    youtube = build('youtube', 'v3', developerKey=api_key, static_discovery=False)
    
    all_videos = []
    next_page_token = None
    
    while True:
        # チャンネルの動画リストを取得
        search_response = youtube.search().list(
            channelId=channel_id,
            part='id,snippet',
            order='date',
            maxResults=50,
            pageToken=next_page_token,
            type='video'
        ).execute()
        
        # デバッグログ追加
        print(f"Search API response: totalResults={search_response.get('pageInfo', {}).get('totalResults', 0)}, resultsPerPage={search_response.get('pageInfo', {}).get('resultsPerPage', 0)}")
        print(f"Items count: {len(search_response.get('items', []))}")
        if not search_response.get('items'):
            print(f"Full search response: {json.dumps(search_response, indent=2)}")
        
        video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
        
        if video_ids:
            # 動画の詳細情報を取得
            videos_response = youtube.videos().list(
                part='snippet,contentDetails,statistics,liveStreamingDetails',
                id=','.join(video_ids)
            ).execute()
            
            for video in videos_response.get('items', []):
                video_data = {
                    'video_id': video['id'],
                    'title': video['snippet']['title'],
                    'description': video['snippet'].get('description', ''),
                    'published_at': video['snippet']['publishedAt'],
                    'duration': video['contentDetails']['duration'],
                    'view_count': video['statistics'].get('viewCount', 0),
                    'like_count': video['statistics'].get('likeCount', 0),
                    'comment_count': video['statistics'].get('commentCount', 0),
                    'thumbnail_url': video['snippet']['thumbnails']['high']['url'],
                    'is_live': 'liveStreamingDetails' in video,
                    'scheduled_start_time': video.get('liveStreamingDetails', {}).get('scheduledStartTime'),
                    'actual_start_time': video.get('liveStreamingDetails', {}).get('actualStartTime'),
                    'actual_end_time': video.get('liveStreamingDetails', {}).get('actualEndTime'),
                    'concurrent_viewers': video.get('liveStreamingDetails', {}).get('concurrentViewers'),
                }
                all_videos.append(video_data)
        
        next_page_token = search_response.get('nextPageToken')
        if not next_page_token:
            break
    
    print(f"Fetched {len(all_videos)} videos")
    return all_videos

def import_to_database(videos, config):
    """動画データをデータベースにインポート"""
    print("Importing data to database...")
    
    conn = psycopg2.connect(
        host=config['DB_HOST'],
        port=config['DB_PORT'],
        database=config['DB_NAME'],
        user=config['DB_USER'],
        password=config['DB_PASSWORD']
    )
    
    try:
        with conn.cursor() as cursor:
            # 既存のデータをクリア（オプション）
            # cursor.execute("TRUNCATE TABLE videos CASCADE")
            
            for video in videos:
                # UPSERT処理
                cursor.execute("""
                    INSERT INTO videos (
                        video_id, title, description, published_at, duration,
                        view_count, like_count, comment_count, thumbnail_url,
                        is_live, scheduled_start_time, actual_start_time,
                        actual_end_time, concurrent_viewers, created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )
                    ON CONFLICT (video_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        view_count = EXCLUDED.view_count,
                        like_count = EXCLUDED.like_count,
                        comment_count = EXCLUDED.comment_count,
                        concurrent_viewers = EXCLUDED.concurrent_viewers,
                        updated_at = CURRENT_TIMESTAMP
                """, (
                    video['video_id'],
                    video['title'],
                    video['description'],
                    video['published_at'],
                    video['duration'],
                    int(video['view_count']) if video['view_count'] else 0,
                    int(video['like_count']) if video['like_count'] else 0,
                    int(video['comment_count']) if video['comment_count'] else 0,
                    video['thumbnail_url'],
                    video['is_live'],
                    video['scheduled_start_time'],
                    video['actual_start_time'],
                    video['actual_end_time'],
                    int(video['concurrent_viewers']) if video['concurrent_viewers'] else None
                ))
            
            conn.commit()
            print(f"Successfully imported {len(videos)} videos")
    
    except Exception as e:
        conn.rollback()
        print(f"Database import error: {str(e)}")
        raise
    finally:
        conn.close()

def lambda_handler(event, context):
    """Lambda関数のメインハンドラー"""
    print(f"Sync batch started at {datetime.now().isoformat()}")
    print(f"Event: {json.dumps(event)}")
    
    try:
        # 環境設定を読み込み
        config = load_environment()
        
        # YouTube APIキーの確認
        if not config.get('YOUTUBE_API_KEY'):
            raise ValueError("YouTube API key not configured")
        
        # YouTubeデータを取得
        videos = fetch_youtube_data(
            api_key=config['YOUTUBE_API_KEY'],
            channel_id=os.environ.get('YOUTUBE_CHANNEL_ID', 'UCdBK1mJKjm0B7ykJPsFQO6A')
        )
        
        if not videos:
            print("No videos found to import")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'No videos found',
                    'timestamp': datetime.now().isoformat()
                })
            }
        
        # データベースにインポート
        import_to_database(videos, config)
        
        result = {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Successfully synced {len(videos)} videos',
                'video_count': len(videos),
                'timestamp': datetime.now().isoformat()
            })
        }
        
        print(f"Sync batch completed successfully: {result}")
        return result
        
    except Exception as e:
        error_message = f"Sync batch failed: {str(e)}"
        print(error_message)
        print(traceback.format_exc())
        
        # CloudWatch Alarmのためにエラーを再発生
        raise Exception(error_message)

if __name__ == "__main__":
    # ローカルテスト用
    lambda_handler({}, None)