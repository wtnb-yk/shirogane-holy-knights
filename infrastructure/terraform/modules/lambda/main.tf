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
}

# Lambda Function
resource "aws_lambda_function" "api" {
  filename         = var.lambda_jar_path
  function_name    = "${var.project_name}-${var.environment}-api"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "com.shirogane.holy.knights.infrastructure.lambda.SpringBootLambdaHandler"
  source_code_hash = filebase64sha256(var.lambda_jar_path)

  runtime     = "java17"
  memory_size = var.memory_size
  timeout     = var.timeout

  environment {
    variables = {
      SPRING_PROFILES_ACTIVE = "lambda"
      SPRING_CLOUD_FUNCTION_DEFINITION = "archiveSearch"
      MAIN_CLASS = "com.shirogane.holy.knights.Application"
      DB_HOST               = var.db_host
      DB_NAME               = var.db_name
      DB_USERNAME           = var.db_username
      DB_PASSWORD           = var.db_password
      JDBC_DATABASE_URL     = "jdbc:postgresql://${var.db_host}/${var.db_name}"
      JDBC_DATABASE_USERNAME = var.db_username
      JDBC_DATABASE_PASSWORD = var.db_password
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

  depends_on = [
    aws_iam_role_policy.lambda_policy,
    aws_cloudwatch_log_group.lambda
  ]
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
}
