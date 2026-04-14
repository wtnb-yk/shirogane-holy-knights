# maintenance-site

`noe-room.com` で配信するリニューアル告知用の静的 1 ページ。
既存のフルスタック（VPC/RDS/Lambda/API Gateway/Amplify/Bastion/Pipeline/Batch）を停止し、
S3 + CloudFront の静的配信に切り替えてコストをほぼゼロにする。

## 配置物

- `index.html` — 告知ページ本体（Google Fonts CDN 以外の外部依存なし）
- `favicon.png` — favicon（`frontend/public/favicon.png` 由来）
- `og-home.png` — OG画像（`frontend/public/og-images/og-home.png` 由来）

## インフラ構成

- **Terraform モジュール**: `infrastructure/terraform/modules/maintenance-site`
- **環境設定**: `infrastructure/terraform/environments/prd`
- S3 バケット（プライベート、CloudFront OAC 経由のみ）
- CloudFront ディストリビューション（HTTPS、カスタムドメイン）
- ACM 証明書（DNS 検証、us-east-1）
- Route53 レコード（apex + www、A/AAAA）
- 共有画像 CDN（リニューアル後も引き続き利用）

## デプロイ手順

### 1. Terraform でインフラを構築

```bash
cd infrastructure/terraform/environments/prd
terraform init
terraform plan    # 変更内容を必ず確認（旧リソースの削除を含む）
terraform apply
```

### 2. 静的ファイルを S3 にアップロード

```bash
BUCKET=$(terraform output -raw maintenance_site_bucket_name)
DIST_ID=$(terraform output -raw maintenance_site_cloudfront_distribution_id)

aws s3 sync ../../../../maintenance-site/ "s3://${BUCKET}/" \
  --exclude "README.md" \
  --delete \
  --cache-control "public, max-age=3600"
```

### 3. CloudFront キャッシュを無効化

```bash
aws cloudfront create-invalidation \
  --distribution-id "${DIST_ID}" \
  --paths '/*'
```

## リニューアル復帰時

1. `infrastructure/terraform/environments/prd/main.tf` を元のフルスタック構成に戻す
2. `terraform apply` で新インフラを構築
3. DNS が新しい CloudFront/Amplify に切り替わったら maintenance-site モジュールを削除