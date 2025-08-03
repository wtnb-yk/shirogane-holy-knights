# Terraform Backend Configuration for S3 Remote State
# 一時的にコメントアウト - S3バケットとDynamoDBテーブル作成後に有効化
# terraform {
#   backend "s3" {
#     bucket         = "shirogane-holy-knights-terraform-state"
#     key            = "dev/terraform.tfstate"
#     region         = "ap-northeast-1"
#     dynamodb_table = "shirogane-holy-knights-terraform-locks"
#     encrypt        = true
#   }
# }