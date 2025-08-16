# ECS Cluster for batch processing
resource "aws_ecs_cluster" "batch" {
  name = "${var.project_name}-${var.environment}-batch"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-cluster"
  }
}

# CloudWatch Log Group for batch tasks
resource "aws_cloudwatch_log_group" "batch" {
  name              = "/ecs/${var.project_name}-${var.environment}-batch"
  retention_in_days = 14

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-logs"
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-${var.environment}-batch-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-execution-role"
  }
}

# IAM Role for ECS Task (actual container runtime)
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-${var.environment}-batch-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-task-role"
  }
}

# Attach AWS managed policy for ECS task execution
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Policy for task to access Secrets Manager
resource "aws_iam_role_policy" "ecs_task_secrets" {
  name = "${var.project_name}-${var.environment}-batch-secrets-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          var.youtube_api_secret_arn,
          var.db_secret_arn
        ]
      }
    ]
  })
}

# ECR Repository for batch container
resource "aws_ecr_repository" "batch" {
  name                 = "${var.project_name}-${var.environment}-batch"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-repository"
  }
}

# ECR Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "batch" {
  repository = aws_ecr_repository.batch.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ECS Task Definition
resource "aws_ecs_task_definition" "batch" {
  family                   = "${var.project_name}-${var.environment}-batch"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn           = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "batch-processor"
      image = "${aws_ecr_repository.batch.repository_url}:latest"
      
      essential = true
      
      environment = [
        {
          name  = "AWS_DEFAULT_REGION"
          value = "ap-northeast-1"
        }
      ]
      
      secrets = [
        {
          name      = "YOUTUBE_API_KEY"
          valueFrom = var.youtube_api_secret_arn
        },
        {
          name      = "DB_PASSWORD"
          valueFrom = "${var.db_secret_arn}:password::"
        },
        {
          name      = "DB_HOST"
          valueFrom = "${var.db_secret_arn}:host::"
        },
        {
          name      = "DB_USERNAME"
          valueFrom = "${var.db_secret_arn}:username::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.batch.name
          awslogs-region        = "ap-northeast-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-task"
  }
}

# EventBridge Rules for scheduled execution (4 times daily)
resource "aws_cloudwatch_event_rule" "batch_schedule" {
  count = length(var.schedule_expressions)
  
  name                = "${var.project_name}-${var.environment}-batch-schedule-${count.index + 1}"
  description         = "Trigger batch processing ${count.index + 1}/4 daily"
  schedule_expression = var.schedule_expressions[count.index]

  tags = {
    Name = "${var.project_name}-${var.environment}-batch-schedule-${count.index + 1}"
  }
}

# EventBridge Targets
resource "aws_cloudwatch_event_target" "batch_target" {
  count = length(var.schedule_expressions)
  
  rule      = aws_cloudwatch_event_rule.batch_schedule[count.index].name
  target_id = "BatchTarget${count.index + 1}"
  arn       = aws_ecs_cluster.batch.arn
  role_arn  = aws_iam_role.events.arn

  ecs_target {
    task_count          = 1
    task_definition_arn = aws_ecs_task_definition.batch.arn
    launch_type         = "FARGATE"
    platform_version    = "LATEST"
    
    network_configuration {
      subnets          = var.subnet_ids
      security_groups  = [var.security_group_id]
      assign_public_ip = false
    }
  }
}

# IAM Role for EventBridge to run ECS tasks
resource "aws_iam_role" "events" {
  name = "${var.project_name}-${var.environment}-events-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-events-role"
  }
}

# Policy for EventBridge to run ECS tasks
resource "aws_iam_role_policy" "events_ecs_policy" {
  name = "${var.project_name}-${var.environment}-events-ecs-policy"
  role = aws_iam_role.events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:RunTask"
        ]
        Resource = aws_ecs_task_definition.batch.arn
      },
      {
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = [
          aws_iam_role.ecs_task_execution.arn,
          aws_iam_role.ecs_task.arn
        ]
      }
    ]
  })
}