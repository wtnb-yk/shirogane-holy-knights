# Terraform Backend Configuration - Using S3 remote state
terraform {
  backend "s3" {
    bucket         = "shirogane-holy-knights-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "shirogane-holy-knights-terraform-locks"
    encrypt        = true
  }
}
