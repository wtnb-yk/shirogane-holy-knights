#!/bin/bash

set -e

FUNCTION_NAME="shirogane-holy-knights-api"
LOCALSTACK_ENDPOINT="http://localstack:4566"
REGION="ap-northeast-1"

echo "Lambda関数セットアップ開始..."

# IAMロール作成
echo "IAMロール作成中..."
aws iam create-role \
    --role-name lambda-role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }]
    }' \
    --endpoint-url $LOCALSTACK_ENDPOINT \
    --region $REGION 2>/dev/null || true

# 既存のLambda関数を削除
echo "既存のLambda関数を削除中..."
aws lambda delete-function \
    --function-name $FUNCTION_NAME \
    --endpoint-url $LOCALSTACK_ENDPOINT \
    --region $REGION 2>/dev/null || true

# Lambda関数作成
echo "Lambda関数作成中..."
aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime java17 \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --handler org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest \
    --zip-file fileb:///app/build/libs/shirogane-holy-knights-0.1.0-all.jar \
    --environment "Variables={SPRING_CLOUD_FUNCTION_DEFINITION=apiGatewayFunction,SPRING_PROFILES_ACTIVE=lambda,DATABASE_HOST=postgres,DATABASE_PORT=5432,DATABASE_NAME=shirogane,DATABASE_USERNAME=postgres,DATABASE_PASSWORD=postgres}" \
    --timeout 60 \
    --memory-size 1024 \
    --endpoint-url $LOCALSTACK_ENDPOINT \
    --region $REGION

echo "Lambda関数セットアップ完了"
