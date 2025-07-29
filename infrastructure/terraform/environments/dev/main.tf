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

# ACM certificate for API Gateway custom domain requires us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

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
  
  # CORS設定（dev環境専用Origin設定）
  cors_allowed_origins = "https://dev.noe-room.com,https://main.d3tuiikdacsjk0.amplifyapp.com"
  
  api_gateway_execution_arn = module.api_gateway.api_execution_arn
}

# API Gateway
module "api_gateway" {
  source = "../../modules/api-gateway"

  environment      = var.environment
  project_name     = var.project_name
  lambda_function_name = module.lambda.function_name
  lambda_invoke_arn    = module.lambda.invoke_arn
  
  # Custom domain settings for dev environment
  custom_domain_name = "api.dev.noe-room.com"
  hosted_zone_id     = "Z04900993DUUUVXCT5E57"

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

# SSM Parameter for GitHub token
data "aws_ssm_parameter" "github_token" {
  name            = "/shirogane-holy-knights/dev/github-token"
  with_decryption = true
}

# Amplify
module "amplify" {
  source = "../../modules/amplify"

  environment         = var.environment
  project_name        = var.project_name
  github_repository   = var.github_repository
  github_branch       = var.github_branch
  github_access_token = data.aws_ssm_parameter.github_token.value
  
  
  environment_variables = {
    NEXT_PUBLIC_API_URL = coalesce(module.api_gateway.custom_domain_endpoint, module.api_gateway.api_endpoint)
    PORT = "3000"
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
  }
  
  custom_domain = "noe-room.com"
}