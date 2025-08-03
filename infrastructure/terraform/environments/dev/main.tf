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

# Secrets Manager
module "secrets" {
  source = "../../modules/secrets"

  environment  = var.environment
  project_name = var.project_name
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
  enable_nat_instance = var.enable_nat_instance
  region = var.aws_region
  allowed_db_client_cidrs = var.allowed_db_client_cidrs
}

# データベース
module "database" {
  source = "../../modules/database"

  environment            = var.environment
  project_name           = var.project_name
  subnet_ids             = module.network.private_subnet_ids
  vpc_security_group_ids = [module.network.database_security_group_id]
  
  db_instance_class    = var.db_instance_class
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  use_secrets_manager  = true
  db_secret_arn        = module.secrets.secret_arn
  publicly_accessible  = var.db_publicly_accessible
  skip_final_snapshot  = true
}

# Lambda
module "lambda" {
  source = "../../modules/lambda"

  environment     = var.environment
  project_name    = var.project_name
  subnet_ids      = module.network.private_subnet_ids
  security_group_ids = [module.network.lambda_security_group_id]
  
  db_host         = replace(module.database.db_endpoint, ":5432", "")
  db_port         = "5432"
  db_name         = var.db_name
  db_username     = var.db_username
  db_password     = var.db_password
  
  # Secrets Manager設定
  use_secrets_manager       = true
  db_secret_arn            = module.secrets.secret_arn
  secrets_access_policy_arn = module.secrets.secrets_access_policy_arn
  
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
  hosted_zone_id = "Z04900993DUUUVXCT5E57"
}

# Bastion Host
module "bastion" {
  source = "../../modules/bastion"

  environment  = var.environment
  project_name = var.project_name
  aws_region   = var.aws_region
  vpc_id       = module.network.vpc_id
  subnet_id    = module.network.private_subnet_ids[0]  # Use first private subnet
  vpc_endpoint_subnet_ids = module.network.private_subnet_ids
  db_endpoint  = replace(module.database.db_endpoint, ":5432", "")
}

# CodePipeline
module "pipeline" {
  source = "../../modules/pipeline"

  environment    = var.environment
  project_name   = var.project_name
  vpc_id         = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  private_subnet_arns = [
    "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:subnet/${module.network.private_subnet_ids[0]}",
    "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:subnet/${module.network.private_subnet_ids[1]}"
  ]
  
  rds_endpoint          = module.database.db_endpoint
  rds_secret_arn        = module.secrets.secret_arn
  db_name               = var.db_name
  lambda_function_arn   = module.lambda.function_arn
  lambda_function_name  = module.lambda.function_name
  github_repository_id  = var.github_repository_id
}

# Additional security group rule for bastion -> database access
resource "aws_security_group_rule" "bastion_to_database" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = module.bastion.security_group_id
  security_group_id        = module.network.database_security_group_id
  description              = "Database access from bastion host"
}

# Pipeline migration -> database access
resource "aws_security_group_rule" "pipeline_to_database" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = module.pipeline.migration_security_group_id
  security_group_id        = module.network.database_security_group_id
  description              = "Database access from CodeBuild migration"
}

# Current account data
data "aws_caller_identity" "current" {}


