# IAM Role for Lambda
resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Get RDS credentials from Secrets Manager
data "aws_secretsmanager_secret_version" "db_credentials" {
  count     = var.use_secrets_manager ? 1 : 0
  secret_id = var.db_secret_arn
}

locals {
  db_credentials = var.use_secrets_manager ? jsondecode(data.aws_secretsmanager_secret_version.db_credentials[0].secret_string) : {}
  db_username    = var.use_secrets_manager ? try(local.db_credentials.username, var.db_username) : var.db_username
  db_password    = var.use_secrets_manager ? try(local.db_credentials.password, var.db_password) : var.db_password
}

# IAM Policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-${var.environment}-lambda-policy"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:AssignPrivateIpAddresses",
          "ec2:UnassignPrivateIpAddresses"
        ]
        Resource = "*"
      }
    ]
  })
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-api"
  retention_in_days = var.log_retention_days

  lifecycle {
    ignore_changes = [name]
  }
}

# Lambda Function
resource "aws_lambda_function" "api" {
  filename         = var.lambda_jar_path
  function_name    = "${var.project_name}-${var.environment}-api"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest"
  source_code_hash = filebase64sha256(var.lambda_jar_path)

  runtime     = "java17"
  memory_size = var.memory_size
  timeout     = var.timeout
  publish     = true  # Publish version for SnapStart

  environment {
    variables = {
      SPRING_CLOUD_FUNCTION_DEFINITION = "apiGatewayFunction"
      MAIN_CLASS = "com.shirogane.holy.knights.Application"
      DATABASE_HOST     = var.db_host
      DATABASE_PORT     = var.db_port
      DATABASE_NAME     = var.db_name
      DATABASE_USERNAME = local.db_username
      DATABASE_PASSWORD = local.db_password
      CORS_ALLOWED_ORIGINS = var.cors_allowed_origins
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

  # SnapStart configuration for faster cold starts
  snap_start {
    apply_on = "PublishedVersions"
  }

  depends_on = [
    aws_iam_role_policy.lambda_policy,
    aws_cloudwatch_log_group.lambda
  ]
}

# Attach the IAM policy from secrets module if using Secrets Manager
resource "aws_iam_role_policy_attachment" "secrets_access" {
  count      = var.use_secrets_manager ? 1 : 0
  role       = aws_iam_role.lambda_execution.name
  policy_arn = var.secrets_access_policy_arn
}

# Lambda Alias
resource "aws_lambda_alias" "live" {
  name             = "live"
  description      = "Live alias pointing to latest published version"
  function_name    = aws_lambda_function.api.function_name
  function_version = aws_lambda_function.api.version
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
  
  lifecycle {
    create_before_destroy = true
  }
}
