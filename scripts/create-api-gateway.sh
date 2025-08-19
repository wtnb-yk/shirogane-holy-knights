#!/bin/bash

# API Gateway作成スクリプト（LocalStack用）

set -e

FUNCTION_NAME=${FUNCTION_NAME:-"shirogane-holy-knights-api"}
LOCALSTACK_ENDPOINT=${LOCALSTACK_ENDPOINT:-"http://localstack:4566"}
REGION="ap-northeast-1"

echo "API Gateway作成中..."

# 既存のAPIを削除
aws apigateway get-rest-apis --endpoint-url=$LOCALSTACK_ENDPOINT --query 'items[?name==`shirogane-api`].id' --output text | while read -r api_id; do
    if [ ! -z "$api_id" ]; then
        echo "既存のAPI Gateway ($api_id) を削除中..."
        aws apigateway delete-rest-api --rest-api-id $api_id --endpoint-url=$LOCALSTACK_ENDPOINT
    fi
done

# API Gatewayを作成
API_ID=$(aws apigateway create-rest-api \
    --name "shirogane-api" \
    --endpoint-url=$LOCALSTACK_ENDPOINT \
    --query 'id' --output text)

echo "API ID: $API_ID"

# リソースIDを取得
PARENT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --endpoint-url=$LOCALSTACK_ENDPOINT \
    --query 'items[0].id' --output text)

# プロキシリソースを作成
aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $PARENT_ID \
    --path-part "{proxy+}" \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

PROXY_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --endpoint-url=$LOCALSTACK_ENDPOINT \
    --query 'items[?pathPart==`{proxy+}`].id' --output text)

# ANY メソッドを作成
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --authorization-type NONE \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# Lambda統合を設定
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:000000000000:function:$FUNCTION_NAME/invocations" \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# OPTIONSメソッドを追加（CORS対応）
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# OPTIONSメソッドのMock統合を設定
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# OPTIONSメソッドのレスポンスを設定
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# OPTIONSメソッドの統合レスポンスを設定
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# ルートリソースにもANYメソッドを追加
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PARENT_ID \
    --http-method ANY \
    --authorization-type NONE \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PARENT_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:000000000000:function:$FUNCTION_NAME/invocations" \
    --endpoint-url=$LOCALSTACK_ENDPOINT >/dev/null

# デプロイメントを作成
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name dev \
    --endpoint-url=$LOCALSTACK_ENDPOINT \
    --query 'id' --output text)

echo "API Gateway作成完了: $API_ID"
echo "Deployment ID: $DEPLOYMENT_ID"

# LocalStackではカスタムドメインマッピングは完全にサポートされていないため
# 固定のAPI IDを使用して予測可能なURLを提供

echo ""
echo "========================================="
echo "API Gateway設定完了"
echo "========================================="
echo "通常URL: http://localhost:4566/restapis/$API_ID/dev/_user_request_"
echo "LocalStack URL: http://shirogane-api.execute-api.localhost.localstack.cloud:4566"
echo ""
echo "テスト:"
echo "  curl http://localhost:4566/health"
echo "  curl http://localhost:4566/video-tags"
