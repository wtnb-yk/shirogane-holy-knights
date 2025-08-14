output "lambda_function_arn" {
  description = "ARN of the sync batch Lambda function"
  value       = aws_lambda_function.sync_batch.arn
}

output "lambda_function_name" {
  description = "Name of the sync batch Lambda function"
  value       = aws_lambda_function.sync_batch.function_name
}

output "eventbridge_rule_noon_arn" {
  description = "ARN of the noon EventBridge rule"
  value       = aws_cloudwatch_event_rule.sync_batch_noon.arn
}

output "eventbridge_rule_evening_arn" {
  description = "ARN of the evening EventBridge rule"
  value       = aws_cloudwatch_event_rule.sync_batch_evening.arn
}

output "eventbridge_rule_manual_arn" {
  description = "ARN of the manual trigger EventBridge rule"
  value       = aws_cloudwatch_event_rule.sync_batch_manual.arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch Log Group"
  value       = aws_cloudwatch_log_group.sync_batch_lambda.name
}

output "lambda_layer_arn" {
  description = "ARN of the Python dependencies Lambda layer"
  value       = aws_lambda_layer_version.python_deps.arn
}