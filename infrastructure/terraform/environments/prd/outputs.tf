# Database outputs
output "db_endpoint" {
  description = "RDS instance endpoint"
  value       = module.database.db_endpoint
}

output "db_instance_id" {
  description = "RDS instance ID"
  value       = module.database.db_instance_id
}

# Network outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.network.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.network.public_subnet_ids
}

# Lambda outputs
output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.lambda.function_arn
}

# API Gateway outputs
output "api_gateway_url" {
  description = "API Gateway URL"
  value       = module.api_gateway.api_endpoint
}

output "api_gateway_custom_domain_url" {
  description = "API Gateway custom domain URL"
  value       = module.api_gateway.custom_domain_endpoint
}

# Amplify outputs
output "amplify_app_id" {
  description = "Amplify app ID"
  value       = module.amplify.app_id
}

output "amplify_default_domain" {
  description = "Amplify default domain"
  value       = module.amplify.default_domain
}

output "amplify_custom_domain" {
  description = "Amplify custom domain"
  value       = module.amplify.custom_domain
}

# Secrets Manager outputs
output "secrets_manager_secret_arn" {
  description = "Secrets Manager secret ARN"
  value       = module.secrets.secret_arn
  sensitive   = true
}