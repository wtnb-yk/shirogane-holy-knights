#!/bin/bash

# シンプルヘルスチェックスクリプト
# 単発のヘルスチェックを実行

set -e

# デフォルト設定
API_BASE_URL="${API_BASE_URL:-https://api.shirogane-portal.com}"
HEALTH_LEVEL="${HEALTH_LEVEL:-basic}"
TIMEOUT="${TIMEOUT:-10}"

# ログ関数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# ヘルスチェック実行
check_health() {
    local level="$1"
    local endpoint="/health"
    
    case "$level" in
        basic)
            endpoint="/health/basic"
            ;;
        detailed)
            endpoint="/health/detailed"
            ;;
        complete)
            endpoint="/health/complete"
            ;;
        ready)
            endpoint="/health/ready"
            ;;
        legacy)
            endpoint="/health"
            ;;
        *)
            error "Unknown health level: $level"
            return 1
            ;;
    esac
    
    log "Performing $level health check..."
    log "Endpoint: $API_BASE_URL$endpoint"
    
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" --max-time "$TIMEOUT" "$API_BASE_URL$endpoint" || echo -e "\n000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    log "HTTP Status: $http_code"
    
    if [[ -n "$body" ]]; then
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
    
    case "$http_code" in
        200)
            log "Health check passed"
            return 0
            ;;
        503)
            error "Service unavailable"
            return 1
            ;;
        000)
            error "Connection failed or timeout"
            return 1
            ;;
        *)
            error "Unexpected HTTP status: $http_code"
            return 1
            ;;
    esac
}

# 使用方法表示
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Perform a single health check.

OPTIONS:
    -u, --url URL           API base URL (default: https://api.shirogane-portal.com)
    -l, --level LEVEL       Health check level: basic, detailed, complete, ready, legacy (default: basic)
    -t, --timeout SECONDS   Request timeout in seconds (default: 10)
    -h, --help             Show this help message

HEALTH LEVELS:
    basic      Basic service health check
    detailed   Detailed health check including database connectivity
    complete   Complete health check with all dependencies
    ready      Deployment readiness check
    legacy     Legacy health check endpoint

ENVIRONMENT VARIABLES:
    API_BASE_URL           API base URL
    HEALTH_LEVEL           Health check level
    TIMEOUT                Request timeout in seconds

EXAMPLES:
    # Basic health check
    $0

    # Detailed health check
    $0 --level detailed

    # Check deployment readiness
    $0 --level ready

    # Custom API URL
    $0 --url https://dev-api.shirogane-portal.com --level complete

EXIT CODES:
    0    Health check passed
    1    Health check failed
EOF
}

# コマンドライン引数解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            API_BASE_URL="$2"
            shift 2
            ;;
        -l|--level)
            HEALTH_LEVEL="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# 必要なコマンドの確認
if ! command -v curl &> /dev/null; then
    error "curl is required but not installed"
    exit 1
fi

# ヘルスチェック実行
check_health "$HEALTH_LEVEL"