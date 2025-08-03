variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
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
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.13.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = false
}

variable "enable_nat_instance" {
  description = "Enable NAT Instance for private subnets"
  type        = bool
  default     = true
}

# DBクライアント接続用IP制限設定
variable "allowed_db_client_cidrs" {
  description = "CIDR blocks allowed to access database from external clients"
  type        = list(string)
  default     = ["60.87.155.152/32"]  # 現在のパブリックIPアドレス
}

# Database
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
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
  default     = true
}

# Lambda
variable "lambda_jar_path" {
  description = "Path to Lambda JAR file"
  type        = string
  default     = "../../../../backend/build/libs/shirogane-holy-knights-0.1.0-aws-lambda.jar"
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

variable "github_repository_id" {
  description = "GitHub repository ID (e.g., owner/repo-name)"
  type        = string
  default     = "wtnb-yk/shirogane-holy-knights"
}