#!/usr/bin/env bash
set -euo pipefail

ENDPOINT="http://localhost:8000"
TABLE="danin-log-events"

# テーブルが既に存在する場合はスキップ
if aws dynamodb describe-table --endpoint-url "$ENDPOINT" --table-name "$TABLE" --no-cli-pager 2>/dev/null; then
  echo "Table '$TABLE' already exists."
  exit 0
fi

aws dynamodb create-table \
  --endpoint-url "$ENDPOINT" \
  --table-name "$TABLE" \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager

echo "Table '$TABLE' created."
