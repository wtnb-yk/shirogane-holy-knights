variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for DB subnet group"
  type        = list(string)
}

variable "vpc_security_group_ids" {
  description = "Security group IDs for RDS instance"
  type        = list(string)
}

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.13"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage in GB for autoscaling"
  type        = number
  default     = 100
}

variable "db_storage_type" {
  description = "Storage type"
  type        = string
  default     = "gp3"
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database master username (used when use_secrets_manager is false)"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database master password (used when use_secrets_manager is false)"
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

variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot when destroying"
  type        = bool
  default     = false
}

variable "apply_immediately" {
  description = "Apply changes immediately"
  type        = bool
  default     = false
}