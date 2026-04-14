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

variable "tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "shirogane-holy-knights"
    Environment = "prd"
  }
}
