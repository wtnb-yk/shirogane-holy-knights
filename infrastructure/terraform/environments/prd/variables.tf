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

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"  # Different from dev (10.0.0.0/16)
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.1.1.0/24", "10.1.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.1.10.0/24", "10.1.11.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway"
  type        = bool
  default     = false  # Use NAT Instance instead for cost optimization
}

variable "enable_nat_instance" {
  description = "Enable NAT Instance"
  type        = bool
  default     = true  # Use NAT Instance for cost optimization
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"  # Minimum instance for production
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "shirogane_portal"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  default     = "dummy-password"  # Will be overridden by Secrets Manager
  sensitive   = true
}

variable "db_publicly_accessible" {
  description = "Make RDS instance publicly accessible"
  type        = bool
  default     = false  # Production should not be publicly accessible
}

variable "allowed_db_client_cidrs" {
  description = "Allowed CIDR blocks for database client access"
  type        = list(string)
  default     = null  # No direct client access in production
}

# Lambda Configuration
variable "lambda_jar_path" {
  description = "Path to Lambda JAR file"
  type        = string
  default     = "../../../../backend/build/libs/shirogane-holy-knights-0.1.0-aws-lambda.jar"
}

# GitHub Configuration
variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/wtnb-yk/shirogane-holy-knights"
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"  # Use main branch for production
}

variable "github_repository_id" {
  description = "GitHub repository ID for CodeBuild connection"
  type        = string
  default     = "wtnb-yk/shirogane-holy-knights"
}