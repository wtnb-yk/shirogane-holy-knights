# Secrets Manager secret for RDS credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "/${var.project_name}/${var.environment}/rds/credentials"
  description = "RDS database credentials for ${var.project_name} ${var.environment} environment"

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-credentials"
    Environment = var.environment
    Purpose     = "RDS Database Credentials"
  }
}

# IAM policy for accessing the secret
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-${var.environment}-rds-secrets-access"
  description = "Policy to access RDS credentials from Secrets Manager for ${var.environment} environment"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.db_credentials.arn
      }
    ]
  })
}