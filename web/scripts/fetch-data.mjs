/**
 * prebuild スクリプト: S3 から CSV データを web/data/ にダウンロード
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

import { execSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '..', 'data');

const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
  process.env;

if (!AWS_S3_BUCKET) {
  console.log('AWS_S3_BUCKET is not set. Skipping S3 data fetch.');

  if (existsSync(dataDir)) {
    console.log(`Using existing local data in ${dataDir}`);
  } else {
    console.warn(
      `Warning: ${dataDir} does not exist. Run "just migrate" to create the database.`
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

const s3Uri = `s3://${AWS_S3_BUCKET}/csv/`;

console.log(`Fetching CSV data from ${s3Uri} ...`);

try {
  execSync(`aws s3 sync ${s3Uri} ${dataDir} --delete`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_DEFAULT_REGION: AWS_REGION,
    },
  });
  console.log('Data fetch complete.');
} catch (error) {
  console.error('Failed to fetch data from S3:', error.message);
  process.exit(1);
}