#!/bin/bash

# CI/CDパイプライン用デプロイメントヘルスチェックスクリプト
# AWS CodeBuildやGitHub Actionsで使用

set -e

# 環境変数の確認とフォールバック
: "${LAMBDA_FUNCTION_NAME:?Environment variable LAMBDA_FUNCTION_NAME is required}"

# API_GATEWAY_NAMEが設定されていない場合はLAMBDA_FUNCTION_NAMEを使用
if [[ -z "${API_GATEWAY_NAME:-}" ]]; then
    log "API_GATEWAY_NAME not set, using LAMBDA_FUNCTION_NAME: $LAMBDA_FUNCTION_NAME"
    export API_GATEWAY_NAME="$LAMBDA_FUNCTION_NAME"
fi

# ENVIRONMENTが設定されていない場合はLAMBDA_FUNCTION_NAMEから推測
if [[ -z "${ENVIRONMENT:-}" ]]; then
    if [[ "$LAMBDA_FUNCTION_NAME" == *"-prd-"* ]]; then
        export ENVIRONMENT="prod"
    elif [[ "$LAMBDA_FUNCTION_NAME" == *"-stg-"* ]]; then
        export ENVIRONMENT="staging"
    else
        export ENVIRONMENT="dev"
    fi
    log "ENVIRONMENT not set, inferred from function name: $ENVIRONMENT"
fi

: "${AWS_DEFAULT_REGION:?Environment variable AWS_DEFAULT_REGION is required}"

# デフォルト設定
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"
RETRY_DELAY="${RETRY_DELAY:-10}"
TIMEOUT="${TIMEOUT:-15}"

# ログ関数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Lambda関数の状態確認
check_lambda_function() {
    log "Checking Lambda function status..."
    
    local function_state
    function_state=$(aws lambda get-function \
        --function-name "$LAMBDA_FUNCTION_NAME" \
        --query 'Configuration.State' \
        --output text 2>/dev/null || echo "NotFound")
    
    if [[ "$function_state" == "Active" ]]; then
        log "Lambda function is active"
        return 0
    elif [[ "$function_state" == "Pending" ]]; then
        log "Lambda function is still updating..."
        return 1
    else
        error "Lambda function state: $function_state"
        return 1
    fi
}

# API Gateway URLの取得
get_api_gateway_url() {
    log "Getting API Gateway URL..."
    log "Looking for API Gateway with name: $API_GATEWAY_NAME"
    
    local api_id
    api_id=$(aws apigateway get-rest-apis \
        --query "items[?name=='$API_GATEWAY_NAME'].id" \
        --output text 2>/dev/null)
    
    if [[ -z "$api_id" ]] || [[ "$api_id" == "None" ]]; then
        log "Exact name match not found, trying pattern matching..."
        # パターンマッチングで再試行
        api_id=$(aws apigateway get-rest-apis \
            --query "items[?contains(name, '$(echo $API_GATEWAY_NAME | cut -d'-' -f1-3)')].id" \
            --output text 2>/dev/null | head -n1)
        
        if [[ -z "$api_id" ]] || [[ "$api_id" == "None" ]]; then
            error "API Gateway not found with name pattern: $API_GATEWAY_NAME"
            log "Available API Gateways:"
            aws apigateway get-rest-apis --query "items[].{Name:name,Id:id}" --output table 2>/dev/null || true
            return 1
        fi
    fi
    
    log "Found API Gateway ID: $api_id"
    echo "https://${api_id}.execute-api.${AWS_DEFAULT_REGION}.amazonaws.com/${ENVIRONMENT}"
}

# デプロイメント完了判定
main() {
    log "=== Starting deployment health check ==="
    log "Lambda Function: $LAMBDA_FUNCTION_NAME"
    log "API Gateway: $API_GATEWAY_NAME"
    log "Environment: $ENVIRONMENT"
    log "Region: $AWS_DEFAULT_REGION"
    log "Max attempts: $MAX_ATTEMPTS"
    log "Retry delay: ${RETRY_DELAY}s"
    
    # Lambda関数の状態確認（最大5分待機）
    local lambda_attempts=30
    for attempt in $(seq 1 $lambda_attempts); do
        log "Lambda status check attempt $attempt/$lambda_attempts"
        
        if check_lambda_function; then
            log "Lambda function is ready"
            break
        fi
        
        if [[ "$attempt" -eq "$lambda_attempts" ]]; then
            error "Lambda function did not become active within timeout"
            return 1
        fi
        
        log "Waiting ${RETRY_DELAY}s before next Lambda check..."
        sleep "$RETRY_DELAY"
    done
    
    # API Gateway URLの取得
    local api_url
    api_url=$(get_api_gateway_url)
    if [[ $? -ne 0 ]]; then
        error "Failed to get API Gateway URL"
        return 1
    fi
    
    log "API URL: $api_url"
    
    # ヘルスチェックスクリプトの実行
    if [[ ! -f "scripts/check-deployment-readiness.sh" ]]; then
        error "Health check script not found: scripts/check-deployment-readiness.sh"
        return 1
    fi
    
    chmod +x scripts/check-deployment-readiness.sh
    
    log "Performing deployment readiness check..."
    if scripts/check-deployment-readiness.sh \
        --url "$api_url" \
        --max-attempts "$MAX_ATTEMPTS" \
        --delay "$RETRY_DELAY" \
        --timeout "$TIMEOUT"; then
        
        log "=== Deployment health check passed ==="
        return 0
    else
        error "=== Deployment health check failed ==="
        return 1
    fi
}

# 使用方法表示
show_usage() {
    cat << EOF
Usage: $0

CI/CD pipeline deployment health check script.

REQUIRED ENVIRONMENT VARIABLES:
    LAMBDA_FUNCTION_NAME    Lambda function name
    API_GATEWAY_NAME        API Gateway name
    ENVIRONMENT             Environment (dev, staging, prod)
    AWS_DEFAULT_REGION      AWS region

OPTIONAL ENVIRONMENT VARIABLES:
    MAX_ATTEMPTS            Maximum number of health check attempts (default: 30)
    RETRY_DELAY             Delay between attempts in seconds (default: 10)
    TIMEOUT                 Request timeout in seconds (default: 15)

EXAMPLES:
    # Basic usage in CI/CD
    export LAMBDA_FUNCTION_NAME="shirogane-dev-api"
    export API_GATEWAY_NAME="shirogane-dev-api"
    export ENVIRONMENT="dev"
    export AWS_DEFAULT_REGION="ap-northeast-1"
    $0

    # With custom settings
    export MAX_ATTEMPTS=60
    export RETRY_DELAY=5
    $0

EXIT CODES:
    0    Deployment health check passed
    1    Deployment health check failed
EOF
}

# コマンドライン引数解析
case "${1:-}" in
    -h|--help)
        show_usage
        exit 0
        ;;
    "")
        # 引数なしで実行
        ;;
    *)
        error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac

# 必要なコマンドの確認
for cmd in aws curl; do
    if ! command -v "$cmd" &> /dev/null; then
        error "$cmd is required but not installed"
        exit 1
    fi
done

# メイン処理実行
main