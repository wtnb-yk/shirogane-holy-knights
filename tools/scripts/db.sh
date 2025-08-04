#!/bin/bash

# Database Tunnel Manager for Shirogane Holy Knights
# セキュアなBastion経由DB接続ツール

set -euo pipefail

# Environment will be set in main function
ENVIRONMENT=""

# Configuration variables (will be set in main function)
TERRAFORM_DIR=""
INSTANCE_ID=""
DB_ENDPOINT=""
DB_NAME=""
SECRET_ID=""

DB_PORT=5432
SESSION_FILE="$(dirname "$0")/.db-session"
FIXED_PORT=15432

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
ROCKET="🚀"
SEARCH="🔍"
LINK="🔗"
CHECK="✅"
INFO="💡"
CLOCK="⏰"
TOOL="🔧"
STOP="🛑"
CLIPBOARD="📋"

# Initialize environment configuration
init_environment() {
    # Validate environment
    if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prd" ]]; then
        log_error "無効な環境: '$ENVIRONMENT'. 'dev' または 'prd' を使用してください。"
        echo "使用方法: $0 [dev|prd] [command]"
        exit 1
    fi
    
    # Set Terraform directory
    TERRAFORM_DIR="$(dirname "$0")/../infrastructure/terraform/environments/$ENVIRONMENT"
    
    # Try to get bastion instance ID from Terraform first
    if [[ -d "$TERRAFORM_DIR" ]]; then
        INSTANCE_ID=$(cd "$TERRAFORM_DIR" && terraform output -raw bastion_instance_id 2>/dev/null || echo "")
    fi
    
    # Fallback to AWS CLI if Terraform fails
    if [[ -z "$INSTANCE_ID" || "$INSTANCE_ID" == "None" ]]; then
        # Get instances managed by Terraform (has ManagedBy=Terraform tag)
        INSTANCE_ID=$(aws ec2 describe-instances \
            --filters "Name=tag:Name,Values=shirogane-holy-knights-$ENVIRONMENT-bastion" \
                      "Name=tag:ManagedBy,Values=Terraform" \
                      "Name=instance-state-name,Values=running,stopped" \
            --query 'Reservations[0].Instances[0].InstanceId' \
            --output text 2>/dev/null)
    fi
    
    if [[ -z "$INSTANCE_ID" || "$INSTANCE_ID" == "None" ]]; then
        log_error "Terraform管理のBastionインスタンスが見つかりません"
        log_warning "ヒント: cd infrastructure/terraform/environments/$ENVIRONMENT && terraform apply"
        exit 1
    fi
    
    # Environment-specific database configuration
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        DB_ENDPOINT="shirogane-holy-knights-dev-db.chki60iywt92.ap-northeast-1.rds.amazonaws.com"
        DB_NAME="shirogane"
        SECRET_ID="/shirogane-holy-knights/dev/rds/credentials"
    else
        # prd environment - get from Terraform output
        DB_ENDPOINT=$(cd "$TERRAFORM_DIR" && terraform output -raw db_endpoint 2>/dev/null | sed 's/:5432$//' || echo "")
        if [[ -z "$DB_ENDPOINT" ]]; then
            log_error "prd環境のDB endpointが取得できません"
            log_warning "ヒント: cd infrastructure/terraform/environments/prd && terraform apply"
            exit 1
        fi
        DB_NAME="shirogane_portal"
        SECRET_ID="/shirogane-holy-knights/prd/rds/credentials"
    fi
    
    log_info "環境: $ENVIRONMENT"
    log_info "DB Endpoint: $DB_ENDPOINT"
    log_info "Instance ID: $INSTANCE_ID"
}

# Utility functions
log_info() {
    echo -e "${CYAN}$1${NC}"
}

log_success() {
    echo -e "${GREEN}$1${NC}"
}

log_warning() {
    echo -e "${YELLOW}$1${NC}"
}

log_error() {
    echo -e "${RED}$1${NC}"
}

log_step() {
    echo -e "${PURPLE}$1${NC}"
}

# Check if port is available
is_port_available() {
    local port=$1
    ! lsof -i :$port >/dev/null 2>&1
}

# Check if port 15432 is available
check_port_available() {
    local port=15432
    
    # Check if port is actively listening (not just closed connections)
    if lsof -i :"$port" | grep -q "LISTEN"; then
        log_error "ポート $port は既に使用中です"
        log_info "既存のセッションを停止してから再実行してください: ./db.sh stop"
        return 1
    fi
    
    echo "$port"
    return 0
}

# Check if bastion instance is running
is_instance_running() {
    local state
    state=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].State.Name' \
        --output text 2>/dev/null || echo "error")
    
    [[ "$state" == "running" ]]
}

# Check if instance is ready for Session Manager
is_ssm_ready() {
    # Check if instance is running and SSM agent is ready
    aws ssm describe-instance-information \
        --filters "Key=InstanceIds,Values=$INSTANCE_ID" \
        --query 'InstanceInformationList[0].PingStatus' \
        --output text 2>/dev/null | grep -q "Online"
}

# Start bastion instance
start_instance() {
    log_step "$ROCKET Bastionインスタンス起動中..."
    
    if is_instance_running; then
        log_info "インスタンスは既に起動中です"
        # Still need to check if SSM is ready
        if is_ssm_ready; then
            log_success "Session Manager接続準備完了"
            return 0
        else
            log_warning "Session Manager接続待機中..."
        fi
    else
        # Start the instance
        log_info "インスタンスを起動しています..."
        aws ec2 start-instances --instance-ids "$INSTANCE_ID" >/dev/null
    fi
    
    # Wait for instance to be running
    local attempts=0
    local max_attempts=30
    
    log_info "インスタンス起動完了待機中..."
    while ! is_instance_running && [[ $attempts -lt $max_attempts ]]; do
        echo -n "."
        sleep 2
        ((attempts++))
    done
    
    if ! is_instance_running; then
        echo ""
        log_error "インスタンス起動がタイムアウトしました"
        return 1
    fi
    
    echo ""
    log_success "インスタンス起動完了"
    
    # Wait for SSM agent to be ready
    log_info "Session Manager接続準備待機中..."
    attempts=0
    max_attempts=60  # Longer timeout for SSM agent
    
    while ! is_ssm_ready && [[ $attempts -lt $max_attempts ]]; do
        echo -n "."
        sleep 2
        ((attempts++))
    done
    
    if is_ssm_ready; then
        echo ""
        log_success "Session Manager接続準備完了"
        return 0
    else
        echo ""
        log_error "Session Manager接続準備がタイムアウトしました"
        return 1
    fi
}

# Test database connection (simplified - just check if port responds)
test_db_connection() {
    local port=$1
    
    # Simple port connectivity test
    if command -v nc >/dev/null 2>&1; then
        # Use netcat if available
        echo | nc -w 2 localhost "$port" >/dev/null 2>&1
    elif command -v telnet >/dev/null 2>&1; then
        # Fallback to telnet
        timeout 2 telnet localhost "$port" >/dev/null 2>&1
    else
        # If neither nc nor telnet is available, skip the test
        log_warning "nc or telnet not found, skipping connection test"
        return 0
    fi
}

# Start port forwarding
start_tunnel() {
    local port=$1
    
    log_step "$SEARCH ポート15432の確認中..."
    
    if ! port=$(check_port_available); then
        return 1
    fi
    
    log_step "$LINK ポートフォワーディング開始 (localhost:$port)"
    
    # Start port forwarding with nohup for persistence
    log_info "Session Manager起動中..."
    nohup aws ssm start-session \
        --target "$INSTANCE_ID" \
        --document-name AWS-StartPortForwardingSessionToRemoteHost \
        --parameters "{\"host\":[\"$DB_ENDPOINT\"],\"portNumber\":[\"$DB_PORT\"],\"localPortNumber\":[\"$port\"]}" \
        > /tmp/ssm-debug-$$.log 2>&1 &
    
    local aws_pid=$!
    disown $aws_pid
    
    # Wait for session-manager-plugin to start
    log_info "セッション確立待機中..."
    local attempts=0
    local tunnel_pid=""
    while [[ -z "$tunnel_pid" && $attempts -lt 10 ]]; do
        sleep 1
        tunnel_pid=$(pgrep -f "session-manager-plugin.*$port" | head -1)
        ((attempts++))
    done
    
    if [[ -z "$tunnel_pid" ]]; then
        log_error "Session Managerプロセスの起動に失敗しました"
        # Check debug log
        if [[ -f "/tmp/ssm-debug-$$.log" ]]; then
            log_error "エラー詳細:"
            tail -5 "/tmp/ssm-debug-$$.log"
        fi
        return 1
    fi
    
    # Save session info immediately
    cat > "$SESSION_FILE" << EOF
PORT=$port
PID=$tunnel_pid
START_TIME=$(date +%s)
INSTANCE_ID=$INSTANCE_ID
EOF
    
    # Wait a moment for tunnel to establish
    sleep 3
    
    # Test if tunnel is working
    if ! test_db_connection "$port"; then
        log_warning "接続テストに失敗しました（ポート転送の確立を待機中...）"
        # Give it more time
        sleep 2
        if ! test_db_connection "$port"; then
            log_warning "接続テストは失敗しましたが、セッションは開始されました"
        else
            log_success "接続テスト成功"
        fi
    else
        log_success "接続テスト成功"
    fi
    
    show_connection_info "$port"
    
    return 0
}

# Show connection information
show_connection_info() {
    local port=$1
    
    echo ""
    log_success "$CHECK DB接続準備完了！"
    echo ""
    log_info "$CLIPBOARD DBクライアント接続設定:"
    echo "   Host: localhost"
    echo "   Port: $port"
    echo "   Database: $DB_NAME"
    echo "   Username: [Secrets Managerから取得済み]"
    echo "   Password: [Secrets Managerから取得済み]"
    echo ""
    log_info "$INFO 認証情報取得方法:"
    echo "   aws secretsmanager get-secret-value \\"
    echo "     --secret-id $SECRET_ID \\"
    echo "     --query SecretString --output text | jq -r '.username'"
    echo ""
    log_warning "$CLOCK セッションは永続化されています"
    log_info "$TOOL 停止するには: ./db.sh stop"
    log_success "$CHECK スクリプト終了後も接続は維持されます"
    echo ""
}

# Show current status
show_status() {
    if [[ ! -f "$SESSION_FILE" ]]; then
        log_warning "アクティブなセッションはありません"
        return 0
    fi
    
    source "$SESSION_FILE"
    
    # Check if process is still running
    if ! kill -0 "$PID" 2>/dev/null; then
        log_error "トンネルプロセスが停止しています"
        rm -f "$SESSION_FILE"
        return 1
    fi
    
    # Check if port is still in use
    if ! lsof -i :"$PORT" >/dev/null 2>&1; then
        log_error "ポート $PORT は使用されていません"
        return 1
    fi
    
    local current_time start_time elapsed_minutes remaining_minutes
    current_time=$(date +%s)
    elapsed_minutes=$(( (current_time - START_TIME) / 60 ))
    remaining_minutes=$(( 28 - elapsed_minutes ))
    
    if [[ $remaining_minutes -le 0 ]]; then
        remaining_minutes=0
    fi
    
    echo ""
    log_success "$CHECK アクティブなDB接続トンネル:"
    echo "   Port: $PORT"
    echo "   PID: $PID"
    echo "   経過時間: ${elapsed_minutes}分"
    echo "   残り時間: ${remaining_minutes}分"
    echo ""
    
    if [[ $remaining_minutes -le 5 ]]; then
        log_warning "まもなく自動停止されます"
    fi
}

# Stop tunnel
stop_tunnel() {
    if [[ ! -f "$SESSION_FILE" ]]; then
        log_warning "アクティブなセッションはありません"
        return 0
    fi
    
    source "$SESSION_FILE"
    
    log_step "$STOP トンネル停止中..."
    
    # Kill the tunnel process
    if kill -0 "$PID" 2>/dev/null; then
        kill "$PID" 2>/dev/null || true
        log_success "トンネルプロセスを停止しました"
    fi
    
    # Clean up session file
    rm -f "$SESSION_FILE"
    
    # Stop bastion instance
    log_step "Bastionインスタンス停止中..."
    aws ec2 stop-instances --instance-ids "$INSTANCE_ID" >/dev/null
    log_success "Bastionインスタンスを停止しました"
    
    echo ""
    log_success "DB接続セッションを終了しました"
}

# Show help
show_help() {
    echo "Database Tunnel Manager for Shirogane Holy Knights"
    echo ""
    echo "使用方法:"
    echo "  $0            - デフォルトポートでトンネル開始"
    echo "  $0 <port>     - 指定ポートでトンネル開始"
    echo "  $0 status     - 現在の状態確認"
    echo "  $0 stop       - トンネル停止とBastion停止"
    echo "  $0 help       - このヘルプを表示"
    echo ""
    echo "例:"
    echo "  $0           # 自動ポート選択（15432, 25432, ...）"
    echo "  $0 25432     # ポート25432を指定"
    echo "  $0 status    # 状態確認"
    echo "  $0 stop      # 停止"
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    # Check required commands
    if ! command -v aws >/dev/null 2>&1; then
        missing_deps+=("aws")
    fi
    
    if ! command -v jq >/dev/null 2>&1; then
        missing_deps+=("jq")
    fi
    
    if ! command -v lsof >/dev/null 2>&1; then
        missing_deps+=("lsof")
    fi
    
    # Optional but recommended
    if ! command -v nc >/dev/null 2>&1 && ! command -v telnet >/dev/null 2>&1; then
        log_warning "nc または telnet が見つかりません（接続テストをスキップします）"
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "必要なコマンドが見つかりません: ${missing_deps[*]}"
        echo ""
        echo "インストール方法:"
        for dep in "${missing_deps[@]}"; do
            case "$dep" in
                "aws")
                    echo "  AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
                    ;;
                "jq")
                    echo "  jq: brew install jq"
                    ;;
                "lsof")
                    echo "  lsof: システムに含まれているはずです"
                    ;;
            esac
        done
        return 1
    fi
    
    return 0
}

# Main logic
main() {
    # Handle arguments: [environment] [command] [port]
    local arg1="${1:-}"
    local arg2="${2:-}"
    local arg3="${3:-}"
    
    # If first argument is env (dev/prd), shift arguments
    if [[ "$arg1" == "dev" || "$arg1" == "prd" ]]; then
        ENVIRONMENT="$arg1"
        local command="$arg2"
        local port_arg="$arg3"
    else
        # Default environment is dev
        ENVIRONMENT="dev" 
        local command="$arg1"
        local port_arg="$arg2"
    fi
    
    # Check dependencies first (except for help)
    if [[ "$command" != "help" && "$command" != "-h" && "$command" != "--help" ]]; then
        if ! check_dependencies; then
            exit 1
        fi
        
        # Initialize environment configuration
        init_environment
    fi
    
    case "$command" in
        "help"|"-h"|"--help")
            show_help
            ;;
        "status")
            show_status
            ;;
        "stop")
            stop_tunnel
            ;;
        "")
            # Start tunnel with default port selection
            if ! start_instance; then
                exit 1
            fi
            if ! start_tunnel ""; then
                exit 1
            fi
            ;;
        [0-9]*)
            # Start tunnel with specified port
            if ! start_instance; then
                exit 1
            fi
            if ! start_tunnel "$command"; then
                exit 1
            fi
            ;;
        *)
            log_error "不明なコマンド: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Cleanup on exit - DON'T kill the session on normal exit
# Only kill if interrupted (Ctrl+C)
cleanup_on_interrupt() {
    log_warning "中断されました"
    if [[ -f "$SESSION_FILE" ]]; then
        source "$SESSION_FILE"
        if kill -0 "$PID" 2>/dev/null; then
            log_info "セッションを停止しています..."
            kill "$PID" 2>/dev/null || true
            rm -f "$SESSION_FILE"
        fi
    fi
    exit 1
}

# Only trap interrupts, not normal exit
trap cleanup_on_interrupt INT TERM

# Run main function
main "$@"