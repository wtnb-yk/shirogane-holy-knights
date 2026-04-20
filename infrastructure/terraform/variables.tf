variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "danin-log"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment package"
  type        = string
  default     = "../lambda/package.zip"
}