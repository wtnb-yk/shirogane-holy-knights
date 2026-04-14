output "api_id" {
  description = "API Gateway ID"
  value       = aws_api_gateway_rest_api.main.id
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_api_gateway_stage.main.invoke_url
}

output "api_execution_arn" {
  description = "API Gateway execution ARN"
  value       = aws_api_gateway_rest_api.main.execution_arn
}

output "stage_name" {
  description = "API Gateway stage name"
  value       = aws_api_gateway_stage.main.stage_name
}

output "custom_domain_name" {
  description = "API Gateway custom domain name"
  value       = var.custom_domain_name != "" ? aws_api_gateway_domain_name.main[0].domain_name : ""
}

output "custom_domain_endpoint" {
  description = "API Gateway custom domain endpoint URL"
  value       = var.custom_domain_name != "" ? "https://${var.custom_domain_name}" : ""
}