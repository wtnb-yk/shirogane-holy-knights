provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# ネットワーク
module "network" {
  source = "../../modules/network"

  environment    = var.environment
  project_name   = var.project_name
  vpc_cidr       = var.vpc_cidr
  azs            = var.availability_zones
  public_subnets = var.public_subnet_cidrs
  private_subnets = var.private_subnet_cidrs
  enable_nat_gateway = var.enable_nat_gateway
}

# データベース
module "database" {
  source = "../../modules/database"

  environment            = var.environment
  project_name           = var.project_name
  subnet_ids             = module.network.private_subnet_ids
  vpc_security_group_ids = [module.network.database_security_group_id]
  
  db_instance_class = var.db_instance_class
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
}

# Lambda
module "lambda" {
  source = "../../modules/lambda"

  environment     = var.environment
  project_name    = var.project_name
  subnet_ids      = module.network.private_subnet_ids
  security_group_ids = [module.network.lambda_security_group_id]
  
  lambda_jar_path = var.lambda_jar_path
  db_host         = replace(module.database.db_endpoint, ":5432", "")
  db_port         = "5432"
  db_name         = var.db_name
  db_username     = var.db_username
  db_password     = var.db_password
  
  # Lambda performance settings for Spring Boot + R2DBC
  memory_size = 1024
  timeout     = 60
  
  api_gateway_execution_arn = module.api_gateway.api_execution_arn
}

# API Gateway
module "api_gateway" {
  source = "../../modules/api-gateway"

  environment      = var.environment
  project_name     = var.project_name
  lambda_function_name = module.lambda.function_name
  lambda_invoke_arn    = module.lambda.invoke_arn
}

# Amplify
module "amplify" {
  source = "../../modules/amplify"

  environment         = var.environment
  project_name        = var.project_name
  github_repository   = var.github_repository
  github_branch       = var.github_branch
  github_access_token = var.github_access_token
  
  build_spec = file("${path.module}/amplify-buildspec.yml")
  
  environment_variables = {
    NEXT_PUBLIC_API_ENDPOINT = module.api_gateway.api_endpoint
  }
}