variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment package"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name for data storage"
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN for IAM policy"
  type        = string
}

variable "youtube_secret_arn" {
  description = "ARN of the YouTube API key secret"
  type        = string
}

variable "deploy_hook_secret_arn" {
  description = "ARN of the Vercel Deploy Hook secret"
  type        = string
}
