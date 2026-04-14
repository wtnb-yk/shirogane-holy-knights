output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.batch.name
}

output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.batch.arn
}

output "task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.batch.arn
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.batch.repository_url
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.batch.name
}

output "schedule_rule_names" {
  description = "Names of the EventBridge schedule rules"
  value       = aws_cloudwatch_event_rule.batch_schedule[*].name
}

output "log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.batch.name
}