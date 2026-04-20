output "youtube_api_secret_arn" {
  description = "ARN of the YouTube API key secret"
  value       = aws_secretsmanager_secret.youtube_api.arn
}

output "deploy_hook_secret_arn" {
  description = "ARN of the Vercel Deploy Hook secret"
  value       = aws_secretsmanager_secret.deploy_hook.arn
}
