# maintenance-site

`noe-room.com` で配信するリニューアル告知用の静的 1 ページ。
インフラ本体は `infrastructure/terraform/modules/maintenance-site` を参照。

## 配置物

- `index.html` — 告知ページ本体（Google Fonts CDN 以外の外部依存なし）
- `favicon.png` — faviconコピー（`frontend/public/favicon.png` 由来）
- `og-home.png` — OG画像コピー（`frontend/public/og-images/og-home.png` 由来）

## デプロイ

Terraform で S3 バケット / CloudFront を作成した前提で:

```bash
# 1. バケット名と distribution id を取得
cd infrastructure/terraform/environments/prd
BUCKET=$(terraform output -raw maintenance_site_bucket_name)
DIST_ID=$(terraform output -raw maintenance_site_cloudfront_distribution_id)

# 2. 静的ファイルを同期（README は除外）
cd -
aws s3 sync maintenance-site/ "s3://${BUCKET}/" \
  --exclude "README.md" \
  --delete \
  --cache-control "public, max-age=3600"

# 3. CloudFront キャッシュを無効化
aws cloudfront create-invalidation \
  --distribution-id "${DIST_ID}" \
  --paths '/*'
```
