"""
Lambda handler: YouTube データ取得 → SQLite 更新 → S3 アップロード → Deploy Hook

EventBridge Scheduler から 15 分間隔で呼び出される。
データに差分がある場合のみ S3 アップロード + Vercel Deploy Hook を実行。
"""

import json
import os
import urllib.request

import boto3

from youtube_fetcher import fetch_and_update

S3_BUCKET = os.environ['S3_BUCKET']
S3_DB_KEY = os.environ['S3_DB_KEY']
YOUTUBE_SECRET_ARN = os.environ['YOUTUBE_SECRET_ARN']
DEPLOY_HOOK_SECRET_ARN = os.environ['DEPLOY_HOOK_SECRET_ARN']

DB_PATH = '/tmp/danin-log.db'

s3 = boto3.client('s3')
secrets = boto3.client('secretsmanager')


def get_secret(arn):
    resp = secrets.get_secret_value(SecretId=arn)
    return resp['SecretString']


def lambda_handler(event, context):
    # 1. Get secrets
    api_key = get_secret(YOUTUBE_SECRET_ARN)
    deploy_hook_url = get_secret(DEPLOY_HOOK_SECRET_ARN)

    # 2. Download DB from S3
    print(f'Downloading {S3_DB_KEY} from {S3_BUCKET}')
    s3.download_file(S3_BUCKET, S3_DB_KEY, DB_PATH)

    # 3. Fetch YouTube data and update DB
    added = fetch_and_update(api_key, DB_PATH)

    # 4. Skip if no changes
    if added == 0:
        print('No new videos. Skipping S3 upload and deploy hook.')
        return {
            'statusCode': 200,
            'body': json.dumps({'added': 0, 'deployed': False}),
        }

    # 5. Upload updated DB to S3
    print(f'Uploading {S3_DB_KEY} to {S3_BUCKET}')
    s3.upload_file(DB_PATH, S3_BUCKET, S3_DB_KEY)

    # 6. Trigger Vercel Deploy Hook
    print('Triggering Vercel Deploy Hook')
    req = urllib.request.Request(deploy_hook_url, method='POST', data=b'')
    with urllib.request.urlopen(req) as resp:
        print(f'Deploy Hook response: {resp.status}')

    return {
        'statusCode': 200,
        'body': json.dumps({'added': added, 'deployed': True}),
    }
