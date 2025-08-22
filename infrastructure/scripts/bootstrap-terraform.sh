#!/bin/bash

# Terraform Backend Bootstrap Script
# このスクリプトはTerraformのbackend用リソースをセットアップします

set -e

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# スクリプトの実行場所を確認
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BOOTSTRAP_DIR="${SCRIPT_DIR}/../terraform/bootstrap"

echo -e "${GREEN}Terraform Backend Bootstrap開始${NC}"
echo "======================================"

# bootstrapディレクトリに移動
cd "${BOOTSTRAP_DIR}"

# 既存リソースの確認
echo -e "\n${YELLOW}既存リソースの確認中...${NC}"

# S3バケットの存在確認
BUCKET_NAME="shirogane-holy-knights-terraform-state"
if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  S3バケット '${BUCKET_NAME}' は既に存在します${NC}"
    BUCKET_EXISTS=true
else
    echo -e "${GREEN}✓ S3バケットは存在しません。作成します${NC}"
    BUCKET_EXISTS=false
fi

# DynamoDBテーブルの存在確認
TABLE_NAME="shirogane-holy-knights-terraform-locks"
if aws dynamodb describe-table --table-name "${TABLE_NAME}" --region ap-northeast-1 2>/dev/null 1>/dev/null; then
    echo -e "${YELLOW}⚠️  DynamoDBテーブル '${TABLE_NAME}' は既に存在します${NC}"
    TABLE_EXISTS=true
else
    echo -e "${GREEN}✓ DynamoDBテーブルは存在しません。作成します${NC}"
    TABLE_EXISTS=false
fi

# 両方存在する場合
if [ "$BUCKET_EXISTS" = true ] && [ "$TABLE_EXISTS" = true ]; then
    echo -e "\n${YELLOW}両方のリソースが既に存在します。${NC}"
    read -p "Terraformでimportして管理下に置きますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}処理を中止しました${NC}"
        exit 0
    fi
fi

# Terraform初期化
echo -e "\n${GREEN}Terraform初期化中...${NC}"
terraform init

# 既存リソースのimport
if [ "$BUCKET_EXISTS" = true ]; then
    echo -e "\n${YELLOW}S3バケットをimport中...${NC}"
    terraform import aws_s3_bucket.terraform_state "${BUCKET_NAME}" || true
    terraform import aws_s3_bucket_versioning.terraform_state "${BUCKET_NAME}" || true
    terraform import aws_s3_bucket_server_side_encryption_configuration.terraform_state "${BUCKET_NAME}" || true
    terraform import aws_s3_bucket_public_access_block.terraform_state "${BUCKET_NAME}" || true
fi

if [ "$TABLE_EXISTS" = true ]; then
    echo -e "\n${YELLOW}DynamoDBテーブルをimport中...${NC}"
    terraform import aws_dynamodb_table.terraform_locks "${TABLE_NAME}" || true
fi

# Terraform plan
echo -e "\n${GREEN}実行計画の確認...${NC}"
terraform plan -out=tfplan

# 確認
echo -e "\n${YELLOW}上記の変更を適用しますか？${NC}"
read -p "続行しますか？ (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}処理を中止しました${NC}"
    rm -f tfplan
    exit 0
fi

# Terraform apply
echo -e "\n${GREEN}リソース作成中...${NC}"
terraform apply tfplan
rm -f tfplan

# 出力の表示
echo -e "\n${GREEN}作成完了！${NC}"
echo "======================================"
terraform output

echo -e "\n${GREEN}✅ Terraform backendのセットアップが完了しました${NC}"
echo -e "${YELLOW}次のステップ:${NC}"
echo "1. 各環境のbackend.tfファイルで上記のリソースを参照してください"
echo "2. terraform init -migrate-state でstateを移行してください"