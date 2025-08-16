# Secrets Manager secret for RDS credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "/${var.project_name}/${var.environment}/rds/credentials"
  description = "RDS database credentials for ${var.project_name} ${var.environment} environment"
  
  lifecycle {
    ignore_changes = [name]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-credentials"
    Environment = var.environment
    Purpose     = "RDS Database Credentials"
  }
}

# Secrets Manager secret for YouTube API key
resource "aws_secretsmanager_secret" "youtube_api" {
  name = "/${var.project_name}/${var.environment}/youtube/api-key"
  description = "YouTube Data API key for ${var.project_name} ${var.environment} environment"
  
  lifecycle {
    ignore_changes = [name]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-youtube-api-key"
    Environment = var.environment
    Purpose     = "YouTube Data API Key"
  }
}

# IAM policy for accessing the secret
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-${var.environment}-secrets-access"
  description = "Policy to access secrets from Secrets Manager for ${var.environment} environment"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.db_credentials.arn,
          aws_secretsmanager_secret.youtube_api.arn
        ]
      }
    ]
  })

  lifecycle {
    create_before_destroy = true
  }
}