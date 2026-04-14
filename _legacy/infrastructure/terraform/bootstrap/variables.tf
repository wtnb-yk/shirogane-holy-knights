# Bootstrap用の変数定義

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-northeast-1"
}

variable "state_bucket_name" {
  description = "S3 bucket name for Terraform state storage"
  type        = string
  default     = "shirogane-holy-knights-terraform-state"
}

variable "lock_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
  default     = "shirogane-holy-knights-terraform-locks"
}

variable "tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "shirogane-holy-knights"
    Environment = "shared"
    Terraform   = "true"
  }
}