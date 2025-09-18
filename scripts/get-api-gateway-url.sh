#!/bin/bash

# API Gateway URLを取得するスクリプト

set -e

# デフォルト設定
ENVIRONMENT="${ENVIRONMENT:-dev}"
REGION="${AWS_REGION:-ap-northeast-1}"

# ログ関数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# API Gateway URLを取得
get_api_gateway_url() {
    local environment="$1"
    
    log "Getting API Gateway URL for environment: $environment"
    
    # API Gateway名を構築
    local api_name="shirogane-holy-knights-${environment}-api"
    
    # API Gateway IDを取得
    local api_id
    api_id=$(aws apigateway get-rest-apis \
        --query "items[?name=='$api_name'].id" \
        --output text \
        --region "$REGION" 2>/dev/null || echo "")
    
    if [[ -z "$api_id" || "$api_id" == "None" ]]; then
        error "API Gateway '$api_name' not found in region $REGION"
        return 1
    fi
    
    # API Gateway URLを構築
    local api_url="https://${api_id}.execute-api.${REGION}.amazonaws.com/prod"
    
    log "API Gateway URL: $api_url"
    echo "$api_url"
    return 0
}

# Lambda Function URLを取得（フォールバック）
get_lambda_function_url() {
    local environment="$1"
    
    log "Getting Lambda Function URL for environment: $environment"
    
    local function_name="shirogane-holy-knights-${environment}-api"
    
    # Lambda Function URLを取得
    local function_url
    function_url=$(aws lambda get-function-url-config \
        --function-name "$function_name" \
        --query 'FunctionUrl' \
        --output text \
        --region "$REGION" 2>/dev/null || echo "")
    
    if [[ -z "$function_url" || "$function_url" == "None" ]]; then
        log "Lambda Function URL not configured for $function_name"
        return 1
    fi
    
    log "Lambda Function URL: $function_url"
    echo "$function_url"
    return 0
}

# 使用方法表示
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS] [ENVIRONMENT]

Get API Gateway or Lambda Function URL for the specified environment.

ARGUMENTS:
    ENVIRONMENT         Environment name (dev, prd) - default: dev

OPTIONS:
    -r, --region REGION AWS region (default: ap-northeast-1)
    -f, --fallback      Try Lambda Function URL if API Gateway not found
    -h, --help          Show this help message

ENVIRONMENT VARIABLES:
    ENVIRONMENT         Environment name
    AWS_REGION          AWS region

EXAMPLES:
    # Get API Gateway URL for dev environment
    $0 dev

    # Get URL with fallback to Lambda Function URL
    $0 --fallback prd

    # Custom region
    $0 --region us-east-1 dev

EXIT CODES:
    0    URL found and returned
    1    URL not found or error occurred
EOF
}

# メイン処理
main() {
    local environment="$ENVIRONMENT"
    local use_fallback=false
    
    # コマンドライン引数解析
    while [[ $# -gt 0 ]]; do
        case $1 in
            -r|--region)
                REGION="$2"
                shift 2
                ;;
            -f|--fallback)
                use_fallback=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            -*)
                error "Unknown option: $1"
                show_usage
                exit 1
                ;;
            *)
                environment="$1"
                shift
                ;;
        esac
    done
    
    # 環境名のバリデーション
    if [[ -z "$environment" ]]; then
        error "Environment is required"
        show_usage
        exit 1
    fi
    
    if [[ ! "$environment" =~ ^(dev|prd)$ ]]; then
        error "Environment must be 'dev' or 'prd'"
        exit 1
    fi
    
    # AWS CLIの確認
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is required but not installed"
        exit 1
    fi
    
    # API Gateway URLを取得
    local api_url
    if api_url=$(get_api_gateway_url "$environment"); then
        echo "$api_url"
        exit 0
    fi
    
    # フォールバックが有効な場合、Lambda Function URLを試行
    if [[ "$use_fallback" == true ]]; then
        log "API Gateway not found, trying Lambda Function URL..."
        if api_url=$(get_lambda_function_url "$environment"); then
            echo "$api_url"
            exit 0
        fi
    fi
    
    error "Could not find API URL for environment: $environment"
    exit 1
}

# スクリプトが直接実行された場合のみメイン処理を実行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi