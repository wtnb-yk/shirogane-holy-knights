/**
 * prebuild スクリプト: S3 から danin-log.db を web/data/ にダウンロード
 *
 * Vercel ビルド時に自動実行される（npm prebuild hook）
 * ローカル開発では pnpm dev を使うため実行されない
 *
 * 必要な環境変数:
 *   AWS_S3_BUCKET - S3 バケット名
 *   AWS_ACCESS_KEY_ID - AWS アクセスキー
 *   AWS_SECRET_ACCESS_KEY - AWS シークレットキー
 *   AWS_REGION - AWS リージョン
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'data');
const dbFile = 'danin-log.db';

const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
  process.env;

if (!AWS_S3_BUCKET) {
  console.log('AWS_S3_BUCKET is not set. Skipping S3 data fetch.');

  if (existsSync(resolve(dataDir, dbFile))) {
    console.log(`Using existing local data in ${dataDir}`);
  } else {
    console.warn(
      `Warning: ${dataDir}/${dbFile} does not exist. Run "just sync-data-local" to copy the database.`
    );
  }

  process.exit(0);
}

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  console.error(
    'Missing AWS credentials. Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION'
  );
  process.exit(1);
}

mkdirSync(dataDir, { recursive: true });

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const destPath = resolve(dataDir, dbFile);

console.log(`Downloading s3://${AWS_S3_BUCKET}/${dbFile} ...`);

try {
  const resp = await s3.send(
    new GetObjectCommand({ Bucket: AWS_S3_BUCKET, Key: dbFile })
  );
  const body = await resp.Body.transformToByteArray();
  writeFileSync(destPath, body);
  console.log(`Data fetch complete. (${(body.length / 1024).toFixed(0)} KB)`);
} catch (error) {
  console.error('Failed to fetch data from S3:', error.message);
  process.exit(1);
}
