variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev/prd)"
  type        = string
}

variable "cpu" {
  description = "CPU units for the batch task (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory for the batch task in MB"
  type        = number
  default     = 512
}

variable "schedule_expressions" {
  description = "List of EventBridge schedule expressions (cron or rate)"
  type        = list(string)
  default     = [
    "cron(0 15 * * ? *)",  # 00:00 JST (15:00 UTC)
    "cron(0 21 * * ? *)",  # 06:00 JST (21:00 UTC) 
    "cron(0 3 * * ? *)",   # 12:00 JST (03:00 UTC)
    "cron(0 9 * * ? *)"    # 18:00 JST (09:00 UTC)
  ]
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "youtube_api_secret_arn" {
  description = "ARN of the YouTube API key secret in Secrets Manager"
  type        = string
}

variable "db_secret_arn" {
  description = "ARN of the database credentials secret in Secrets Manager"
  type        = string
}