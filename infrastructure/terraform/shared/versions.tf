terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "shirogane-holy-knights-terraform-state"
    key            = "shared/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "shirogane-holy-knights-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "ap-northeast-1"

  default_tags {
    tags = {
      Environment = "shared"
      Project     = "shirogane-holy-knights"
      ManagedBy   = "Terraform"
    }
  }
}