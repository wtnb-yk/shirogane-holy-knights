output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.data_updater.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.data_updater.arn
}

output "log_group_name" {
  description = "CloudWatch Logs group name"
  value       = aws_cloudwatch_log_group.lambda.name
}

output "schedule_name" {
  description = "EventBridge Scheduler schedule name"
  value       = aws_scheduler_schedule.every_15min.name
}
