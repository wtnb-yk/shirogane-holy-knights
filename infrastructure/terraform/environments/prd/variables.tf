variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prd"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "shirogane-holy-knights"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

# Network
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"  # dev環境と異なるCIDRを使用
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.1.1.0/24", "10.1.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.1.11.0/24", "10.1.12.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

# DBクライアント接続用IP制限設定（本番環境用）
variable "allowed_db_client_cidrs" {
  description = "CIDR blocks allowed to access database from external clients (production should be more restrictive)"
  type        = list(string)
  default     = []  # 本番環境では明示的に設定が必要
}

# Database
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"  # 本番環境ではdev環境より大きなインスタンス
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "shirogane"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password (not used when Secrets Manager is enabled)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "db_publicly_accessible" {
  description = "Whether the DB instance is publicly accessible (for DB client connections)"
  type        = bool
  default     = false  # 本番環境ではセキュリティ重視でfalse
}

variable "backup_retention_period" {
  description = "Backup retention period in days (production should have longer retention)"
  type        = number
  default     = 30  # 本番環境では長期保持
}

# Lambda
variable "lambda_jar_path" {
  description = "Path to Lambda JAR file"
  type        = string
  default     = "../../../backend/build/libs/shirogane-holy-knights-0.1.0-aws-lambda.jar"
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 2048  # 本番環境では大きなメモリを割り当て
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 60
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins for API Gateway"
  type        = string
  default     = "https://noe-room.com"  # 本番ドメインのみ
}

# API Gateway
variable "api_custom_domain_name" {
  description = "Custom domain name for API Gateway"
  type        = string
  default     = "api.noe-room.com"
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for custom domain"
  type        = string
  default     = "Z04900993DUUUVXCT5E57"
}

# Amplify
variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

variable "github_access_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "amplify_custom_domain" {
  description = "Custom domain for Amplify"
  type        = string
  default     = "noe-room.com"
}