#!/bin/bash

# API Gateway IDを取得してファイルに保存
LOCALSTACK_ENDPOINT="http://localstack:4566"

echo "API Gateway IDを取得中..."

# 最大30秒間API Gatewayの作成を待つ
for i in {1..30}; do
    API_ID=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT apigateway get-rest-apis --query 'items[?name==`shirogane-api`].id' --output text 2>/dev/null)
    
    if [ ! -z "$API_ID" ] && [ "$API_ID" != "None" ]; then
        echo "API ID: $API_ID"
        echo "NEXT_PUBLIC_API_URL=http://localstack:4566/restapis/$API_ID/dev/_user_request_" > /tmp/api-env.txt
        exit 0
    fi
    
    echo "待機中... ($i/30)"
    sleep 1
done

echo "API Gateway IDの取得に失敗しました"
exit 1
