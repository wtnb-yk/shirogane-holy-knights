# VPC Outputs
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.network.private_subnet_ids
}

# Database Outputs
output "db_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = module.database.db_endpoint
}

output "db_instance_id" {
  description = "The RDS instance ID"
  value       = module.database.db_instance_id
}

# Lambda Outputs
output "lambda_function_name" {
  description = "The name of the Lambda function"
  value       = module.lambda.function_name
}

output "lambda_function_arn" {
  description = "The ARN of the Lambda function"
  value       = module.lambda.function_arn
}

# API Gateway Outputs
output "api_endpoint" {
  description = "The API Gateway endpoint URL"
  value       = module.api_gateway.api_endpoint
}

output "api_custom_domain" {
  description = "The API Gateway custom domain"
  value       = module.api_gateway.custom_domain_endpoint
}

# Amplify Outputs
output "amplify_app_id" {
  description = "The ID of the Amplify app"
  value       = module.amplify.app_id
}

output "amplify_app_url" {
  description = "The default URL of the Amplify app"
  value       = module.amplify.app_url
}

output "amplify_custom_domain" {
  description = "The custom domain for the Amplify app"
  value       = "https://noe-room.com"
}

# Bastion Outputs
output "bastion_instance_id" {
  description = "The ID of the bastion EC2 instance"
  value       = module.bastion.instance_id
}

output "bastion_connect_command" {
  description = "Command to connect to bastion via Session Manager"
  value       = module.bastion.connect_command
}

# Pipeline Outputs
output "pipeline_name" {
  description = "The name of the CodePipeline"
  value       = module.pipeline.pipeline_name
}

output "pipeline_arn" {
  description = "The ARN of the CodePipeline"
  value       = module.pipeline.pipeline_arn
}

# CDN Outputs (managed in prd but shared across environments)
output "cdn_s3_bucket_name" {
  description = "Name of the CDN S3 bucket (shared)"
  value       = aws_s3_bucket.images.id
}

output "cdn_s3_bucket_arn" {
  description = "ARN of the CDN S3 bucket (shared)"
  value       = aws_s3_bucket.images.arn
}

output "cdn_cloudfront_url" {
  description = "CloudFront distribution URL (shared)"
  value       = "https://${aws_cloudfront_distribution.images.domain_name}"
}

output "cdn_cloudfront_domain" {
  description = "CloudFront distribution domain name (shared)"
  value       = aws_cloudfront_distribution.images.domain_name
}