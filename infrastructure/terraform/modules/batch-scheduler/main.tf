# Lambda Execution Role
resource "aws_iam_role" "sync_batch_lambda" {
  name = "${var.project_name}-${var.environment}-sync-batch-role"

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

# Lambda Policy
resource "aws_iam_role_policy" "sync_batch_lambda_policy" {
  name = "${var.project_name}-${var.environment}-sync-batch-policy"
  role = aws_iam_role.sync_batch_lambda.id

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
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          var.db_secret_arn,
          var.youtube_secret_arn
        ]
      }
    ]
  })
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "sync_batch_lambda" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-sync-batch"
  retention_in_days = var.log_retention_days
}

# Lambda Layer for Python dependencies
resource "aws_lambda_layer_version" "python_deps" {
  filename   = var.layer_zip_path
  layer_name = "${var.project_name}-${var.environment}-python-deps"

  compatible_runtimes = ["python3.11"]
  
  source_code_hash = filebase64sha256(var.layer_zip_path)
}

# Lambda Function
resource "aws_lambda_function" "sync_batch" {
  filename      = var.lambda_zip_path
  function_name = "${var.project_name}-${var.environment}-sync-batch"
  role          = aws_iam_role.sync_batch_lambda.arn
  handler       = "handler.lambda_handler"
  runtime       = "python3.11"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  source_code_hash = filebase64sha256(var.lambda_zip_path)

  layers = [aws_lambda_layer_version.python_deps.arn]

  environment {
    variables = {
      DB_HOST              = var.db_host
      DB_PORT              = var.db_port
      DB_NAME              = var.db_name
      DB_SECRET_NAME       = "${var.project_name}-${var.environment}-db-credentials"
      YOUTUBE_SECRET_NAME  = "${var.project_name}-youtube-api-key"
      YOUTUBE_CHANNEL_ID   = var.youtube_channel_id
      USE_SECRETS_MANAGER  = "true"
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

  depends_on = [
    aws_iam_role_policy.sync_batch_lambda_policy,
    aws_cloudwatch_log_group.sync_batch_lambda
  ]
}

# EventBridge Schedule Rules - 12:00 JST (03:00 UTC)
resource "aws_cloudwatch_event_rule" "sync_batch_noon" {
  name                = "${var.project_name}-${var.environment}-sync-batch-noon"
  description         = "Trigger sync batch at 12:00 JST daily"
  schedule_expression = "cron(0 3 * * ? *)"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-sync-batch-noon"
    Environment = var.environment
  }
}

# EventBridge Schedule Rules - 18:00 JST (09:00 UTC)
resource "aws_cloudwatch_event_rule" "sync_batch_evening" {
  name                = "${var.project_name}-${var.environment}-sync-batch-evening"
  description         = "Trigger sync batch at 18:00 JST daily"
  schedule_expression = "cron(0 9 * * ? *)"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-sync-batch-evening"
    Environment = var.environment
  }
}

# EventBridge Target for noon schedule
resource "aws_cloudwatch_event_target" "sync_batch_noon" {
  rule      = aws_cloudwatch_event_rule.sync_batch_noon.name
  target_id = "sync-batch-lambda-noon"
  arn       = aws_lambda_function.sync_batch.arn

  input = jsonencode({
    source = "scheduled-event",
    schedule = "noon"
  })
}

# EventBridge Target for evening schedule
resource "aws_cloudwatch_event_target" "sync_batch_evening" {
  rule      = aws_cloudwatch_event_rule.sync_batch_evening.name
  target_id = "sync-batch-lambda-evening"
  arn       = aws_lambda_function.sync_batch.arn

  input = jsonencode({
    source = "scheduled-event",
    schedule = "evening"
  })
}

# Lambda Permission for EventBridge (noon)
resource "aws_lambda_permission" "allow_eventbridge_noon" {
  statement_id  = "AllowExecutionFromEventBridgeNoon"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_batch.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sync_batch_noon.arn
}

# Lambda Permission for EventBridge (evening)
resource "aws_lambda_permission" "allow_eventbridge_evening" {
  statement_id  = "AllowExecutionFromEventBridgeEvening"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_batch.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sync_batch_evening.arn
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "sync_batch_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-sync-batch-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors sync batch lambda errors"
  alarm_actions       = var.alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.sync_batch.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "sync_batch_duration" {
  alarm_name          = "${var.project_name}-${var.environment}-sync-batch-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Maximum"
  threshold           = "540000"  # 9 minutes in milliseconds
  alarm_description   = "Alert when sync batch takes longer than 9 minutes"
  alarm_actions       = var.alarm_actions

  dimensions = {
    FunctionName = aws_lambda_function.sync_batch.function_name
  }
}

# Manual trigger rule (for testing/manual execution)
resource "aws_cloudwatch_event_rule" "sync_batch_manual" {
  name        = "${var.project_name}-${var.environment}-sync-batch-manual"
  description = "Manual trigger for sync batch"
  
  event_pattern = jsonencode({
    source      = ["batch-scheduler"]
    detail-type = ["manual-trigger"]
  })
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-sync-batch-manual"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_event_target" "sync_batch_manual" {
  rule      = aws_cloudwatch_event_rule.sync_batch_manual.name
  target_id = "sync-batch-lambda-manual"
  arn       = aws_lambda_function.sync_batch.arn
}

resource "aws_lambda_permission" "allow_eventbridge_manual" {
  statement_id  = "AllowExecutionFromEventBridgeManual"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sync_batch.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sync_batch_manual.arn
}