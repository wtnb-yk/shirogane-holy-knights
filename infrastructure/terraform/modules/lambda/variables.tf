variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for Lambda VPC configuration"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for Lambda"
  type        = list(string)
}

variable "lambda_jar_path" {
  description = "Path to Lambda JAR file"
  type        = string
}

variable "memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 2048
}

variable "timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 3
}

variable "db_host" {
  description = "Database host endpoint"
  type        = string
}

variable "db_port" {
  description = "Database port"
  type        = string
  default     = "5432"
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password (used when use_secrets_manager is false)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "use_secrets_manager" {
  description = "Whether to use AWS Secrets Manager for database credentials"
  type        = bool
  default     = false
}

variable "db_secret_arn" {
  description = "ARN of the Secrets Manager secret containing database credentials"
  type        = string
  default     = ""
}

variable "secrets_access_policy_arn" {
  description = "ARN of the IAM policy for accessing Secrets Manager"
  type        = string
  default     = ""
}

variable "api_gateway_execution_arn" {
  description = "API Gateway execution ARN"
  type        = string
  default     = ""
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins for this environment"
  type        = string
  default     = "*"
}

variable "provisioned_concurrent_executions" {
  description = "Number of provisioned concurrent executions for Lambda"
  type        = number
  default     = 0
}