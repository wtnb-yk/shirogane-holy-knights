# ---------- Lambda function ----------

resource "aws_lambda_function" "data_updater" {
  function_name    = "${var.project_name}-data-updater"
  runtime          = "python3.12"
  handler          = "handler.lambda_handler"
  timeout          = 120
  memory_size      = 256
  role             = aws_iam_role.lambda.arn
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = {
      S3_BUCKET          = var.s3_bucket_name
      S3_DB_KEY          = "danin-log.db"
      YOUTUBE_SECRET_ARN = var.youtube_secret_arn
      DEPLOY_HOOK_SECRET_ARN = var.deploy_hook_secret_arn
    }
  }
}

# ---------- IAM role for Lambda ----------

resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-data-updater-role"

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

resource "aws_iam_role_policy" "lambda_policy" {
  name = "data-updater-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
        ]
        Resource = "${var.s3_bucket_arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
        ]
        Resource = [
          var.youtube_secret_arn,
          var.deploy_hook_secret_arn,
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# ---------- EventBridge Scheduler ----------

resource "aws_scheduler_schedule" "every_15min" {
  name       = "${var.project_name}-data-update"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "rate(15 minutes)"
  schedule_expression_timezone = "Asia/Tokyo"

  target {
    arn      = aws_lambda_function.data_updater.arn
    role_arn = aws_iam_role.scheduler.arn
  }
}

resource "aws_iam_role" "scheduler" {
  name = "${var.project_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "scheduler_invoke" {
  name = "invoke-lambda"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "lambda:InvokeFunction"
        Resource = aws_lambda_function.data_updater.arn
      }
    ]
  })
}

# ---------- CloudWatch Logs ----------

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.data_updater.function_name}"
  retention_in_days = 14
}
