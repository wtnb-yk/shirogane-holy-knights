output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = module.api_gateway.api_endpoint
}

output "amplify_app_url" {
  description = "Amplify app URL"
  value       = module.amplify.app_url
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = module.database.db_endpoint
  sensitive   = true
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda.function_name
}

output "secrets_manager_name" {
  description = "Secrets Manager secret name"
  value       = module.secrets.secret_name
}

output "secrets_manager_arn" {
  description = "Secrets Manager secret ARN"
  value       = module.secrets.secret_arn
  sensitive   = true
}

# Bastion outputs
output "bastion_instance_id" {
  description = "Bastion EC2 instance ID"
  value       = module.bastion.instance_id
}

output "bastion_start_command" {
  description = "Command to start the bastion instance"
  value       = module.bastion.start_command
}

output "bastion_connect_command" {
  description = "Command to connect to bastion via Session Manager"
  value       = module.bastion.connect_command
}

output "bastion_stop_command" {
  description = "Command to stop the bastion instance"
  value       = module.bastion.stop_command
}