terraform {
  backend "s3" {
    bucket         = "shirogane-holy-knights-terraform-state"
    key            = "environments/prd/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "shirogane-holy-knights-terraform-locks"
    encrypt        = true
  }
}