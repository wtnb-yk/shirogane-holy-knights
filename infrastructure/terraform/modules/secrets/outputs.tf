output "secret_arn" {
  description = "ARN of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.db_credentials.name
}

output "secrets_access_policy_arn" {
  description = "ARN of the IAM policy for accessing the secret"
  value       = aws_iam_policy.secrets_access.arn
}