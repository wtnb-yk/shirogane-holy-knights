variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for Lambda VPC configuration"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for Lambda VPC configuration"
  type        = list(string)
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

variable "db_secret_arn" {
  description = "ARN of the database credentials secret in Secrets Manager"
  type        = string
}

variable "db_secret_name" {
  description = "Name of the database credentials secret"
  type        = string
}

variable "youtube_secret_arn" {
  description = "ARN of the YouTube API key secret in Secrets Manager"
  type        = string
}

variable "youtube_channel_id" {
  description = "YouTube channel ID to sync"
  type        = string
  default     = "UCdyqAaZDKHXg4Ahi7VENThQ"
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 600  # 10 minutes
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512
}

variable "lambda_zip_path" {
  description = "Path to the Lambda function ZIP file"
  type        = string
  default     = "../../../lambda/sync-batch/function.zip"
}

variable "layer_zip_path" {
  description = "Path to the Lambda layer ZIP file"
  type        = string
  default     = "../../../lambda/layers/python-deps/layer.zip"
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention in days"
  type        = number
  default     = 1
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarms trigger"
  type        = list(string)
  default     = []
}